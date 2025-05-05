import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from '../../common/type/request.type';

export async function cancelOrder(req:Request, res:Response){
    const {userId} = req.user as DecodedUser;
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

    const ticket = order.ticket;

    // Pointsleri geri verme
    const pointsUsed = await prisma.point.findFirst({
        where: {
            orderId: order.id,
        },
    });

    if (pointsUsed) {
        await prisma.point.updateMany({
            where: {
                orderId: order.id,
            },
            data: {
                point: pointsUsed.point,
            },
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    
    if (user) {
        const totalAmountToRefund = order.ticket.price * order.quantity;
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                money: {
                    increment: totalAmountToRefund,
                },
            },
        });
    }

    // Order status update
    await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: 'cancelled', 
        },
    });

    // Ticket stock increment
    await prisma.ticket.update({
        where: {
            id: ticket.id,
        },
        data: {
            stock: ticket.stock + order.quantity, 
        },
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Order cancelled successfully and money refunded',
    });
    return
}