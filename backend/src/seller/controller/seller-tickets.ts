import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/types/request.type";
import { handleError } from "../../common/error-handling/handle-error";

export async function sellerTickets(req: Request, res: Response) {
    try {
        const { userId } = req.user as DecodedUser;

        const allSellerTickets = await prisma.ticket.findMany({
            where: {
                userId,
                sold: { not: true },
                status: "approve",
            },
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: "Here are all the tickets you’re currently selling.",
            data: allSellerTickets,
        });
        return

    } catch (error) {
        handleError(res, "Failed to fetch seller tickets", 500);
        return
    }
}