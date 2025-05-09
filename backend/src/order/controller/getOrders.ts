import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';
import redis from '../../common/utils/redis';


export async function getOrders(req:Request, res:Response){
    const { userId } = req.user as DecodedUser;

    const cacheKey = `user:order:${userId}`

    const cachedOrder = await redis.get(cacheKey)

    if(cachedOrder){
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: "Your orders with cache",
            data: JSON.parse(cachedOrder)
        })
        return;
    }

    const orders = await prisma.order.findMany({
        where:{
            userId
        }
    })

    await redis.set(cacheKey, JSON.stringify(orders), 'EX', 50)

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'User all orders',
        data:orders
    });
    return;
}