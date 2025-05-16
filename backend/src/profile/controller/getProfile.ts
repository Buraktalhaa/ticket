import { Request, Response } from 'express';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handleError';
import { DecodedUser } from '../../common/type/request.type';

export async function getProfile(req:Request, res: Response) {
    try { 
        const {userId , email} = req.user as DecodedUser;        
        
        // Find user in db
        const user = await prisma.user.findUnique({
            where: {
                id:userId
            }
        })
    
        if (!user) {
            handleError(res, 'User not found', 404)
            return;
        }
    
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: "Your profile",
            email: email,
            data: {
                user
            }
        })
        return;
    } catch (error) {
        handleError(res, 'Server error', 500)
        return;
    }
}