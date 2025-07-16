import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handle-error";

export async function changeOrderStatus(req: Request, res: Response) {
    try {
        const { id, status } = req.body;
    
        if(!id || !status){
            handleError(res, 'Id or status is empty', 400);
            return
        }

        const validStatuses = ['pending', 'completed', 'cancelled', 'failed', 'approve'];
        
        if (!validStatuses.includes(status)) {
            handleError(res, 'Invalid status value.', 400);
            return
        }

        const findOrder = await prisma.order.findUnique({ where: { id } })
    
        if (!findOrder) {
            handleError(res, 'Order not found in db', 404)
            return;
        }
    
        await prisma.order.update({
            where: {
                id
            },
            data: {
                status: status,
                updatedAt: new Date(),
            }
        });
    
        // COMMENT LINE FOR TESTING
        // TODO:
        if(status == 'approve'){
            // await prisma.point.upsert({
            //     where: {
            //         userId_categoryId: {
            //             userId,
            //             categoryId: ticket.categoryId
            //         }
            //     },
            //     update: {
            //         point: {
            //             increment: pointsToGive * quantity
            //         }
            //     },
            //     create: {
            //         userId,
            //         categoryId: ticket.categoryId,
            //         point: pointsToGive * quantity,
            //     }
            // });
        }
    
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: "Order status updated",
        })
        return; 

    } catch (error) {
        handleError(res, 'Failed to change order status', 500);
        return
    }
}