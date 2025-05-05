import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import { handleError } from '../../common/error-handling/handleError';
import { ResponseStatus } from '../../common/enums/status.enum';


export async function createOrder(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId, quantity, usePoints } = req.body

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: ticketId
        }
    })

    if (!ticket) {
        handleError(res, 'no such ticket with this ticketId', 400)
        return;
    }

    if ((ticket.status === 'processing' || ticket.status === 'deleted' || ticket.status === 'cancelling')) {
        handleError(res, 'The ticket transaction is in process, the ticket is not on sale yet.', 400)
        return;
    }

    // stock check
    if (ticket.stock < quantity) {
        handleError(res, `Not enough tickets in stock. Available: ${ticket.stock}`, 400);
        return;
    }

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


    // burada islemleri yap
    const discount = ticket.discount
    const ticketUnitPrice = (ticket.price * (100 - discount)) / 100;
    const pointsToGive = ticketUnitPrice * ticket.pointRate                     
    let allPrice = ticketUnitPrice * quantity;


    let usedPoints = 0;
    if (usePoints && totalPoints > 0) {
        usedPoints = totalPoints;
        allPrice = Math.max(0, allPrice - usedPoints);
    }

    // user check
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        handleError(res, 'User not found', 400);
        return;
    }

    
    // money check
    const userMoney = user.money;
    if (userMoney < allPrice) {
        handleError(res, 'User money not enough', 400);
        return;
    }

    // decrease money
    await prisma.user.update({
        where: { id: userId },
        data: { money: { decrement: allPrice } }
    });

    // delete points
    if (usedPoints > 0 && usePoints) {
        await prisma.point.updateMany({
            where: {
                userId,
                categoryId: ticket.categoryId,
                expiresAt: { gt: new Date() },
                status: 'unused',
            },
            data: {
                status: 'used'
            }
        });
    }

    // Stock update
    const ticketUpdate = await prisma.ticket.update({
        where: {
            id: ticket.id,
        },
        data: {
            stock: ticket.stock - quantity
        }
    })

    // Sold check
    if (ticketUpdate.stock == 0) {
        await prisma.ticket.update({
            where: {
                id: ticket.id
            },
            data: {
                sold: true
            }
        })
    }

    // Order
    const order = await prisma.order.create({
        data: {
            userId,
            ticketId: ticket.id,
            quantity,
            orderDay: ticket.day,
            orderHour:ticket.hour,
            totalAmount: allPrice,
        }
    })


    // Create point
    await prisma.point.create({
        data: {
            userId,
            categoryId: ticket.categoryId,
            point: pointsToGive * quantity,
            orderId: order.id,
            expiresAt:ticket.pointExpiresAt,
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket bought succesfully',
    });
    return;
}