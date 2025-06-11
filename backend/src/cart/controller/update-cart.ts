import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from '../../common/types/request.type';
import { ResponseStatus } from "../../common/enums/status.enum";

export async function updateCart(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId, count } = req.body;

    try {
        if (!ticketId || typeof count !== 'number') {
            handleError(res, 'Ticket ID and count are required', 400);
            return
        }

        const updatedCart = await prisma.cart.update({
            where: {
                userId
            },
            data: {
                ticketId,
                count
            }
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Cart updated successfully',
            data: updatedCart
        });
        return
        
    } catch (error) {
        handleError(res, 'Error updating cart', 500);
        return
    }
}