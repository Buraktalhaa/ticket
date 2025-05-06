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
    
    // Get active points
    const activePoints = await prisma.point.findMany({
        where: {
            userId,
            categoryId: ticket.categoryId,
            expiresAt: { gt: new Date() },
            status: 'unused',
            order: {
                status: 'completed'
            }
        }
    });

    const totalPoints = activePoints.reduce((sum, p) => sum + p.point, 0);
    let allPrice = ticketUnitPrice * quantity;
    let usedPoints = 0;
    
    if (usePoints && totalPoints > 0) {
        usedPoints = totalPoints;
        allPrice = Math.max(0, allPrice - usedPoints);
    }
    
    // Create a pending order first
    const pendingOrder = await prisma.order.create({
        data: {
            userId,
            ticketId: ticket.id,
            quantity,
            orderDay: ticket.day,
            orderHour: ticket.hour,
            totalAmount: allPrice,
            status: 'pending',
            pointsUsed: usedPoints,
            usePoints: usePoints && totalPoints > 0,
        }
    });

    // Create Stripe payment link with order details
    const paymentLink = await stripe.paymentLinks.create({
        line_items: [
            {
                price: 'price_1RLdB2Q7IH6uHol4Xjqq2hO8',
                quantity: quantity,
            },
        ],
        metadata: {
            userId,
            ticketId,
            orderId: pendingOrder.id,
            quantity: String(quantity),
            usedPoints: String(usedPoints),
            usePoints: String(usePoints && totalPoints > 0),
        },
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        paymentLinkUrl: paymentLink.url,
        orderId: pendingOrder.id
    });
    return;
}
