import { Request, Response } from "express";
import { DecodedUser } from "../../common/type/request.type";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";


export async function editTicket(req: Request, res: Response) {
    const { userId, email } = req.user as DecodedUser;
    const { id, ...restData } = req.body;

    if (!id) {
        handleError(res, 'Ticket ID is missing', 400);
        return
      }

    const ticket = await prisma.ticket.findUnique({
        where: {
            id:id
        }
    });


    if (!ticket) {
        handleError(res, "There is no such ticket", 400)
        return;
    }

    // filtremlemeye yariyormus
    const filteredData = Object.fromEntries(
        Object.entries(restData).filter(([_, value]) => value !== undefined)
    );

    const editedTicket = await prisma.ticket.update({
        where: { 
            id:id 
        },
        data: filteredData
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket edited succesfully',
        ticket: editedTicket
    });
    return;
}