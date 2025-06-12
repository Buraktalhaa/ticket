import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/types/request.type";
import { handleError } from "../../common/error-handling/handle-error";

export async function isSeller(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;

    try {
        const userRole = await prisma.userRole.findUnique({
            where: {
                userId
            },
            select: {
                role: true
            }
        })

        if (!userRole) {
            handleError(res, "User role not found", 404)
            return
        }

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            data: userRole.role.name
        });
        return;

    } catch (error) {
        handleError(res, "Failed to get user role", 500);
        return
    }
}