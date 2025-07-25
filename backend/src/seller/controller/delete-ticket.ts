import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function deleteTicket(req:Request, res:Response){
    try {
        const id = req.params.id

        const ticket = await prisma.ticket.findUnique({
            where:{
                id
            }
        })
    
        if(!ticket){
            handleError(res, "There is no such ticket", 400)
            return;
        }
    
        await prisma.ticket.update({
            where: {
                id:ticket.id
            },
            data:{
                status:"deleted"
            }
        });
    
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Ticket deleted succesfully',
        });
        return;

    } catch (error) {
        handleError(res, 'An error occurred while deleting ticket.', 500);
        return
    }
}