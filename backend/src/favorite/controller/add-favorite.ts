import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { DecodedUser } from "../../common/type/request.type";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function addFavorite(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId } = req.body

    if (!ticketId) {
        handleError(res, 'ticketId is required.', 400);
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

        if (existingFavorite) {
            handleError(res, 'This ticket is already in favorites.', 400)
        }

        const newFavorite = await prisma.favorite.create({
            data: {
                userId,
                ticketId
            }
        });

        res.status(201).json({
            status: ResponseStatus.SUCCESS,
            message: '',
            data: newFavorite
        });
        return
    } catch (error) {
        console.error(error);
        handleError(res, 'An error occurred while adding favorite.', 500)
    }
}