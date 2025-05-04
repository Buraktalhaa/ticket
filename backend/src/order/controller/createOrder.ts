import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import { handleError } from '../../common/error-handling/handleError';
import { ResponseStatus } from '../../common/enums/status.enum';


export async function createOrder(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId, quantity, day, hour, usePoints } = req.body

    const ticket = await prisma.ticket.findUnique({
        where: {
            id:ticketId
        }
    })

    if (ticket?.status == 'processing') {
        handleError(res, 'The ticket transaction is in process, the ticket is not on sale yet.', 400)
        return;
    }

    if (!ticket) {
        handleError(res, 'no such ticket with this ticketId', 400)
        return;
    }

    const reqDate = new Date(day).toISOString().split('T')[0];
    const ticketDate = ticket.day.toISOString().split('T')[0];

    if (ticket.stock < quantity) {
        handleError(res, `Not enough tickets in stock. Available: ${ticket.stock}`, 400);
        return;
    }

    if (ticketDate !== reqDate || ticket.hour !== hour) {
        handleError(res, 'Hour or day does not match with the ticket', 400);
        return;
    }

    const activePoints = await prisma.point.findMany({
        where: {
            userId,
            categoryId: ticket.categoryId,
            expiresAt: { gt: new Date() }
        }
    });

    const totalPoints = activePoints.reduce((sum, p) => sum + p.point, 0);


    // burada islemleri yap

    const discount = ticket.discount
    const ticketUnitPrice = (ticket.price * (100 - discount)) / 100;
    let allPrice = ticketUnitPrice * quantity;

    if (usePoints && totalPoints > 0) {
        const pointValue = totalPoints;
        allPrice = Math.max(0, allPrice - pointValue);
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
    if (usePoints && totalPoints > 0) {
        await prisma.point.deleteMany({
            where: {
                userId,
                categoryId: ticket.categoryId,
                expiresAt: { gt: new Date() }
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
    const ifOrderExists = await prisma.order.findFirst({
        where: {
            userId,
            ticketId: ticket.id,
            orderDay: new Date(day),
            orderHour: hour
        }
    })

    let order;

    if (ifOrderExists) {
        order = await prisma.order.update({
            where: { id: ifOrderExists.id },
            data: {
                quantity: ifOrderExists.quantity + quantity,
                updatedAt: new Date()
            }
        });
    }

    else {
        order = await prisma.order.create({
            data: {
                userId,
                ticketId: ticket.id,
                quantity,
                orderDay: new Date(day),
                orderHour: hour
            }
        })
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);


    const point = await prisma.point.create({
        data: {
            userId,
            categoryId: ticket.categoryId,
            point: quantity * 100,
            orderId: order.id,
            expiresAt
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket created succesfully',
    });
    return;
}