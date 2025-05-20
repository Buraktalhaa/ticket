import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";

export const statusPanel = async (req: Request, res: Response) => {

    const tickets = await prisma.ticket.findMany({
        include: {
            user: {
                select: {
                    id: true,
                }
            }
        }
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Admin status panel',
        data:tickets
    });
    return;
}