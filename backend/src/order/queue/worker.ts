import { Worker } from 'bullmq';
import prisma from '../../common/utils/prisma';
import Stripe from 'stripe';
import redis from '../../common/utils/redis';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
});

export const orderWorker = new Worker('order-queue', async job => {
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

    // Create a pending order first
    const pendingOrder = await prisma.order.create({
        data: {
            userId,
            ticketId: ticket.id,
            quantity,
            orderDay: ticket.day,
            orderHour: ticket.hour,
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
        success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${pendingOrder.id}`,
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

    await redis.set(`payment-link:${userId}:${job.id}`, JSON.stringify(session.url), 'EX', 3600);

    return session.url; 
}, { connection: redis });
