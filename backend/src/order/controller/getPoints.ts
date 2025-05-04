import { Request, Response } from "express";
import { DecodedUser } from "../../common/type/request.type";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";


export async function getUserPoints(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;

    const points = await prisma.point.findMany({
        where: {
            userId,
            expiresAt: {
                gte: new Date(),
            },
        },
        select: {
            id: true,
            point: true,
            expiresAt: true,
            category: {
                select: { name: true }
            },
        },
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        data: points,
    });
}
