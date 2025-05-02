import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from '../../common/type/request.type';


export async function createTicket(req:Request, res:Response){
    const {userId, email} = req.user as DecodedUser;
    const {categoryName, description, hour, day, stock} = req.body

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })

    if(!category){
        handleError(res,`There is no such category as ${categoryName}`, 400)
        return;
    }

    const existingTicket = await prisma.ticket.findFirst({
        where:{
           userId,
           categoryId:category.id,
           hour,
           day:new Date(day), 
        }
    })

    if(existingTicket){
        const updateTicket = await prisma.ticket.update({
            where:{
                id:existingTicket.id
            },
            data:{
                description,
                hour,
                day:new Date(day), 
                stock: existingTicket.stock + stock,
                images: [],
            }
        })
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'ticket updated',
        });
        return;
    }



    const ticket = await prisma.ticket.create({
        data:{
            userId,
            categoryId:category.id,
            description,
            hour,
            day:new Date(day), 
            stock,
            sold: false,
            images: [],
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket created succesfully',
    });
    return;
}