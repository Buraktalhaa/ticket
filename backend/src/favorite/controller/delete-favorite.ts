import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { DecodedUser } from "../../common/type/request.type";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function deleteFavorite(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId } = req.body

    if (!ticketId) {
        handleError(res, 'ticketId is required.', 400);
        return
    }

    try {
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_ticketId: {
                    userId,
                    ticketId
                }
            }
        });

        if (!existingFavorite) {
            handleError(res, 'This ticket is not in favorites.', 400)
            return
        }

        await prisma.favorite.delete({
            where: {
                userId_ticketId: { userId, ticketId }
            }
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Ticket removed from favorites.'
        });
        return

    } catch (error) {
        handleError(res, 'An error occurred while deleting favorite.', 500)
        return
    }
}