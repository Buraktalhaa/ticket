import { Job, QueueEvents, Worker } from 'bullmq';
import prisma from '../../common/utils/prisma';
import Stripe from 'stripe';
import redis from '../../common/utils/redis';
import { orderQueue } from './order-queue';
import { cleanupQueue } from './order-queue';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
});

export const orderWorker = new Worker('order-queue', async (job: Job) => {
    const { userId, ticketId, quantity, usePoints } = job.data;
    console.log("Worker working")

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: ticketId
        }
    });

    if (!ticket) {
        throw new Error('No such ticket with this ticketId');
    }

    if ((ticket.status === 'processing' || ticket.status === 'deleted' || ticket.status === 'cancelling')) {
        throw new Error('The ticket transaction is in process, the ticket is not on sale yet.');

    }

    // stock check
    if (ticket.stock < quantity) {
        throw new Error(`Not enough tickets in stock. Available: ${ticket.stock}`);
    }

    // user check
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Calculate price
    const discount = ticket.discount;
    const ticketUnitPrice = (ticket.price * (100 - discount)) / 100;
    const totalPrice = ticketUnitPrice * quantity;

    let usedPoints = 0;
    let discountAmount = 0;
    let booleanPoints = false

    // Get active points
    if (usePoints) {
        const activePoints = await prisma.point.findMany({
            where: {
                userId,
                categoryId: ticket.categoryId,
                expiresAt: { gt: new Date() },
            }
        });

        const totalPoints = activePoints.reduce((sum, p) => sum + p.point, 0);
        usedPoints = Math.min(totalPoints, totalPrice);
        discountAmount = usedPoints;
        booleanPoints = true
    }

    const finalPrice = Math.max(0, totalPrice - discountAmount);

    // stock decreased
    await prisma.ticket.update({
        where: {
            id: ticket.id,
        },
        data: {
            stock: {
                decrement: quantity,
            },
        },
    });

    // Create a pending order first
    const pendingOrder = await prisma.order.create({
        data: {
            userId,
            ticketId: ticket.id,
            quantity,
            orderDay: ticket.dateTime,
            totalAmount: finalPrice,
            status: 'pending',
            pointsUsed: usedPoints,
            usePoints: booleanPoints,
        }
    });

    // Create Stripe payment link with order details
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'try',
                    product_data: {
                        name: ticket.description,
                        description: ticket.description || undefined,
                    },
                    unit_amount: Math.round(finalPrice / quantity * 100),
                },
                quantity: quantity,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/order/my-orders`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        metadata: {
            userId,
            ticketId,
            orderId: pendingOrder.id,
            quantity: String(quantity),
            usedPoints: String(usedPoints),
            usePoints: String(usePoints && usedPoints > 0),
        },
    });

    console.log('Stripe session:', session);


    if (session.url) {
        await redis.set(`payment-link:${userId}:${job.id}`, session.url, 'EX', 180);
    } else {
        throw new Error('Stripe session URL is null');
    }

    // 5 dakiak sonra completed olmadiysa silcek
    await cleanupQueue.add('cleanup-order', {
        orderId: pendingOrder.id,
        ticketId: ticket.id,
        quantity
    }, {
        delay: 300 * 1000
    });


    return session.url;
}, { connection: redis });




// fail durumuna duserse
orderWorker.on('failed', async (job, error) => {
    if (!job) {
        console.error('Job is undefined');
        return;
    }

    console.error(`Job ${job.id} failed:`, error.message);

    await redis.set(`payment-link:${job.data.userId}:${job.id}`, `ERROR:${error.message}`, 'EX', 180);

    const maxAttempts = 3;
    const currentAttempts = job.attemptsMade || 0;

    if (currentAttempts >= maxAttempts) {
        console.error(`🔁 Job ${job.id} reached max retry attempts (${maxAttempts}). Not re-adding.`);
        return;
    }

    if (error.message.includes('Not enough tickets in stock')) {
        console.warn(`🎟️ Stock problem for Job ${job.id}, not retrying.`);
        return;
    }

    await orderQueue.add('create-order', job.data, {
        attempts: maxAttempts,
        backoff: 5000,
    });

    console.log(`🌀 Re-added failed job ${job.id} to the queue (Attempt ${currentAttempts + 1}/${maxAttempts})`);
});





const orderQueueEvents = new QueueEvents('order-queue', { connection: redis });

// internet kopmasi gibi bir seyde beklemeye gecerse
// jobId: string
orderQueueEvents.on('stalled', async ({ jobId }) => {
    console.warn(`Job stalled: ${jobId}`);

    const job = await orderQueue.getJob(jobId);
    if (!job) {
        console.error(`Job with ID ${jobId} not found.`);
        return;
    }

    console.log(`⏱️ Job ${jobId} has been attempted ${job.attemptsMade} time(s)`);

    const maxAttempts = 3;
    const currentAttempts = job.attemptsMade || 0;

    if (currentAttempts >= maxAttempts) {
        console.error(`🔁 Job ${jobId} reached max retry attempts (${maxAttempts}). Skipping re-add.`);
        return;
    }

    await orderQueue.add('create-order', job.data, {
        attempts: maxAttempts,
        backoff: 5000,
    });

    console.log(`🌀 Re-added stalled job ${jobId} to the queue (Attempt ${currentAttempts + 1}/${maxAttempts}).`);
});