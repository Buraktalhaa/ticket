import { Request, Response } from "express";
import { DecodedUser } from "../../common/type/request.type";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";


export async function editTicket(req:Request, res:Response){
    const {userId, email} = req.user as DecodedUser;
    const { id, hour, day, categoryName, description, stock, sold, newDay, newHour } = req.body;

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })

    if(!category){
        handleError(res,`Category doesn't exists: ${categoryName}`, 400)
        return;
    }


    const ticket = await prisma.ticket.findFirst({
        where:{
            userId,
            categoryId:category.id,
            hour,
            day
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
        data: {
            description,
            stock,
            sold,
            day:newDay,
            hour:newHour
        }
    });
    



    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket edited succesfully',
    });
    return;
}