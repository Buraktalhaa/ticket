import { Request, Response } from 'express';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handle-error';

export async function getOrderDetails(req: Request, res: Response) {
    try {
        const { id } = req.body

        if (!id) {
            handleError(res, 'Order ID is required', 400);
            return;
        }

        const order = await prisma.order.findUnique({
            where: {
                id
            }
        })

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            data: order
        });
        return;
        
    } catch (error) {
        handleError(res, 'An error occurred while retrieving order details', 500);
        return
    }
}