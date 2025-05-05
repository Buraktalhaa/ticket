import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';


export async function getOrders(req:Request, res:Response){
    const { userId } = req.user as DecodedUser;


    await prisma.order.findMany({
        where:{
            userId
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'User all orders',
    });
    return;
}