import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/type/request.type";

export async function sellerTickets(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;


    const allSellerTickets = await prisma.ticket.findMany({
        where: {
            userId,
            sold: {
                not: true
            },
            status: {
                equals: "approve"
            }
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'All seller tickets',
        data: allSellerTickets
    });
    return;
}
