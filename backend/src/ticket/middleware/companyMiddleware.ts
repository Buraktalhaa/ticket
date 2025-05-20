import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from "../../common/type/request.type";
import prisma from "../../common/utils/prisma";



export async function companyMiddleware(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.user as DecodedUser
    const { id } = req.body

    console.log(id)

    const seller = await prisma.user.findUnique({
        where: {
            id:userId
        }
    })

    if(!seller){
        handleError(res, 'seller not found', 400)
        return
    }

    const ticket = await prisma.ticket.findUnique({
        where:{
            id
        }
    })

    if(!ticket){
        handleError(res, 'ticket not found', 400)
        return
    }


    if (seller.companyId !== ticket.companyId) {
        handleError(res, 'You are not seller for company', 403)
        return
    }

    next()
};