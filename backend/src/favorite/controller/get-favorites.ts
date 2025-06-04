import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { DecodedUser } from "../../common/type/request.type";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function getFavorites(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;

    try {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId
            },
            select:{
                ticket:true
            }
        });

        console.log(favorites);
        
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            data: favorites
        });
        return

    } catch (error) {
        console.error(error);
        handleError(res, 'An error occurred while fetching favorites.', 500);
    }
}