import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';

export async function getOrderDetails(req:Request, res:Response){
    const { userId } = req.user as DecodedUser;
    const {id} = req.body

    const order = await prisma.order.findUnique({
        where:{
            id
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Order detail',
        data:order
    });
    return;
}