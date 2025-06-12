import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export const updateTicketStatus = async (req: Request, res: Response) => {
    try {
        const { id, status } = req.body

        if (!id || !status) {
            handleError(res, 'Ticket id and status are required.', 400);
            return;
        }

        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) {
            handleError(res, 'ticket not found', 404)
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
            message: 'Ticket status updated succesfully',
        });
        return;

    } catch (error) {
        handleError(res, 'An error occurred while updating ticket status', 500);
        return
    }
};