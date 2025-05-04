import { Request, Response } from "express";
import { DecodedUser } from "../../common/type/request.type";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";


export async function deleteTicket(req:Request, res:Response){
    const {userId, email} = req.user as DecodedUser;
    const {id, categoryName, hour, day, price} = req.body.description

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })

    const ticket = await prisma.ticket.findUnique({
        where:{
            id
        }
    })

    if(!ticket){
        handleError(res, "There is no such ticket", 400)
        return;
    }

    await prisma.ticket.delete({
        where: {
            id: ticket.id
        }
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Ticket deleted succesfully',
    });
    return;
}