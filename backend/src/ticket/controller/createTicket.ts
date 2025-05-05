import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from '../../common/type/request.type';
import { generatePNR } from "../../common/utils/generatePnr";


export async function createTicket(req:Request, res:Response){
    const {userId} = req.user as DecodedUser;
    const {categoryName, description, hour, day, stock, price, pointRate, pointExpiresAt, discount} = req.body

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })

    if(!category){
        handleError(res,`There is no such category as ${categoryName}`, 400)
        return;
    }

    const seller = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })

    if(!seller){
        handleError(res,'No seller with this userId', 400)
        return
    }

    // user tablosu ayrilirsa gerek olmayacak
    if(seller.companyId === null){
        handleError(res,'Company id null', 400)
        return
    }


    await prisma.ticket.create({
        data:{
            userId,
            pnr:generatePNR(),
            categoryId:category.id,
            description,
            companyId:seller?.companyId,
            pointRate,
            price,
            pointExpiresAt,
            hour,
            discount,
            day:new Date(day), 
            stock,
            images: [],
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket created succesfully',
    });
    return;
}