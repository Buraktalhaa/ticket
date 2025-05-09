import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from '../../common/type/request.type';
import Stripe from "stripe";
import redis from "../../common/utils/redis";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
});

export async function cancelOrder(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            ticket: true,
        },
    });

    if (!order) {
        handleError(res, 'Order not found', 400);
        return;
    }

    if (order.userId !== userId) {
        handleError(res, 'You are not authorized to cancel this order', 400);
        return;
    }

    if (order.status !== 'completed') {
        handleError(res, 'Only completed orders can be cancelled', 400);
        return;
    }


    const ticket = order.ticket;

    if (order.paymentId) {
        try {
            await stripe.refunds.create({
                payment_intent: order.paymentId,
            });
        } catch (err) {
            console.error('Stripe refund error:', err);
            handleError(res, 'Refund failed', 500);
            return;
        }
    }

    const pointsGained = (ticket.price * ticket.pointRate) * order.quantity;
    const pointsToRefund = order.pointsUsed;

    if (order.pointsUsed > 0 || pointsGained > 0) {
        await prisma.point.upsert({
            where: {
                userId_categoryId: {
                    userId,
                    categoryId: ticket.categoryId,
                },
            },
            update: {
                point: {
                    increment: pointsToRefund - pointsGained
                },
            },
            create: {
                userId,
                categoryId: ticket.categoryId,
                point: pointsToRefund - pointsGained
            },
        });
    }


    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
    });


    await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
            stock: ticket.stock + order.quantity,
            sold: false,
        },
    });

    await redis.del(`user:order:${userId}`)

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Order cancelled successfully and money refunded',
    });
    return
}