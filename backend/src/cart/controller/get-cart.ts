import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from '../../common/type/request.type';
import { ResponseStatus } from "../../common/enums/status.enum";

export async function getCart(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;

    try {
        const cartItem = await prisma.cart.findUnique({
            where: {
                userId
            },
            include: {
                ticket: true
            }
        });        
    
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Cart retrieved successfully',
            data: cartItem
        });
        return;
    } catch (error) {
        handleError(res,'Error retrieving cart',500)
        return
    }

}