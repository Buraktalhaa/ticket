import { Request, Response } from 'express';
import { DecodedUser } from '../../common/types/request.type';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handle-error';

export async function getOrders(req: Request, res: Response) {
    try {
        const { userId } = req.user as DecodedUser;

        const orders = await prisma.order.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                createdAt: true,
                orderDay: true,
                quantity: true,
                totalAmount: true,
                status: true,
                ticket: {
                    select: {
                        title: true,
                        description: true,
                    },
                },
            },
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            data: orders,
        });
        return

    } catch (error) {
        handleError(res, 'An error occurred while retrieving orders', 500);
        return
    }
}