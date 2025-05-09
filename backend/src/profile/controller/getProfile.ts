import { Request, Response } from 'express';
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handleError';
import { DecodedUser } from '../../common/type/request.type';
import { getFromRedis, setToRedis } from '../../common/utils/redisGetSet';



export async function getProfile(req:Request, res: Response) {
    try { 
        const {userId , email} = req.user as DecodedUser;
        
        const cacheKey = `user:profile:${userId}`

        const cachedProfile = await getFromRedis(cacheKey)

        if(cachedProfile){
            res.status(200).json({
                status: ResponseStatus.SUCCESS,
                message: "Your profile with cache",
                email: email,
                data: JSON.parse(cachedProfile)
            })
            return;
        }

        // Find user in db
        const user = await prisma.user.findUnique({
            where: {
                id:userId
            },
            include:{

            }
        })
    
        if (!user) {
            handleError(res, 'User not found', 404)
            return;
        }

        setToRedis(cacheKey, JSON.stringify(user), 600)
    
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