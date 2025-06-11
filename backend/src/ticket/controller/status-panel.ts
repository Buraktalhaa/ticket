import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handle-error";

export const statusPanel = async (req: Request, res: Response) => {
    try {
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
            message: 'Moderator dashboard data fetched successfully',
            data: tickets
        });
        return;

    } catch (error) {
        handleError(res, 'Failed to fetch moderator dashboard data', 500);
        return;
    }
};