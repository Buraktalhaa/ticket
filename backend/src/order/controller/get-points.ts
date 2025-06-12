import { Request, Response } from "express";
import { DecodedUser } from "../../common/types/request.type";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handle-error";

export async function getUserPoints(req: Request, res: Response) {
    try {
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
            message: "User's active point balances fetched successfully.",
            data: points,
        });
        return;

    } catch (error) {
        handleError(res, 'Failed to fetch user points.', 500);
        return;
    }
}