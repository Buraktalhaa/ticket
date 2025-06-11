import { Request, Response } from "express";
import { DecodedUser } from '../../common/types/request.type';
import { ResponseStatus } from "../../common/enums/status.enum";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";

export async function addToCart(req: Request, res: Response) {
    try {
        const { userId } = req.user as DecodedUser;
        const { ticketId, count } = req.body;

        if (!ticketId || typeof count !== 'number' || count <= 0) {
            handleError(res, 'Invalid ticketId or count', 400);
            return
        }

        const existing = await prisma.cart.findUnique({
            where: {
                userId,
            }
        });

        if (existing) {
            res.status(409).json({
                status: ResponseStatus.ERROR,
                message: 'Ticket is already in cart. Use update instead.'
            });
            return
        }

        const newCartItem = await prisma.cart.create({
            data: {
                userId,
                ticketId,
                count
            }
        });

        const findTitle = await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        })

        const title = findTitle?.title
        console.log({ newCartItem, title });


        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Ticket added to cart successfully',
            data: { newCartItem, title },
        });
        return
    } catch (error) {
        handleError(res, 'An unexpected error occurred while adding to cart', 500);
        return
    }
}