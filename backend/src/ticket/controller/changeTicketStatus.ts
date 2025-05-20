import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from '../../common/type/request.type';

export const updateTicketStatus = async (req: Request, res: Response) => {
    const { id, status } = req.body

    const ticket = await prisma.ticket.findUnique({
        where: {
            id
        }
    });

    if (!ticket) {
        handleError(res, 'ticket not found', 400)
        return;
    }

    await prisma.ticket.update({
        where: {
            id
        },
        data: {
            status
        }
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket status updated succesfully',
    });
    return;
}