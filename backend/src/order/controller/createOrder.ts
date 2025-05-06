// createOrder.ts
import { Request, RequestHandler, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import { handleError } from '../../common/error-handling/handleError';
import { ResponseStatus } from '../../common/enums/status.enum';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
});

// ngrok u ac

export async function createOrder(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId, quantity, usePoints } = req.body;

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: ticketId
        }
    });

    if (!ticket) {
        handleError(res, 'no such ticket with this ticketId', 400);
        return;
    }

    if ((ticket.status === 'processing' || ticket.status === 'deleted' || ticket.status === 'cancelling')) {
        handleError(res, 'The ticket transaction is in process, the ticket is not on sale yet.', 400);
        return;
    }

    // stock check
    if (ticket.stock < quantity) {
        handleError(res, `Not enough tickets in stock. Available: ${ticket.stock}`, 400);
        return;
    }

    // user check
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        handleError(res, 'User not found', 400);
        return;
    }

    // Calculate price
    const discount = ticket.discount;
    const ticketUnitPrice = (ticket.price * (100 - discount)) / 100;
    const totalPrice = ticketUnitPrice * quantity;

    let usedPoints = 0;
    let discountAmount = 0;
    let totalPoints = 0;
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
                    unit_amount: Math.round(finalPrice / quantity * 100), // kuruş cinsinden
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

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        checkoutUrl: session.url,
        orderId: pendingOrder.id
    });
    return;
}
