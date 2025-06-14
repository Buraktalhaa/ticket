import { NextFunction, Request, Response } from "express";
import { handleError } from "../error-handling/handle-error";
import { DecodedUser } from "../types/request.type";
import prisma from "../utils/prisma";

export async function companyMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.user as DecodedUser;
        const ticketId = req.body.id;

        if (!ticketId) {
            handleError(res, 'Ticket ID must be provided in the request body.', 400);
            return
        }

        const seller = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, companyId: true }
        });

        if (!seller) {
            handleError(res, 'Seller not found.', 404);
            return
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { id: true, companyId: true }
        });

        if (!ticket) {
            handleError(res, 'Ticket not found.', 404);
            return
        }

        if (seller.companyId !== ticket.companyId) {
            handleError(res, 'You are not authorized to manage this ticket.', 403);
            return
        }

        next();

    } catch (err) {
        handleError(res, 'An unexpected error occurred during authorization.', 500);
        return
    }
}