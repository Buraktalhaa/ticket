import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getProfile(req:Request, res: Response) {
    try {
        const authId = (req as any).user.userId;

        const user = await prisma.user.findUnique({
            where: {
                authId: authId
            }
        })
        console.log(user)
    
        if (!user) {
            res.status(404).json({
                message: 'User not found',
            });
            return;
        }
    
        res.status(200).json({
            message: "your profile",
            authId: user.id,
            data: {
                user
            }
        })
        return;
    } catch (error) {
        res.status(500).json({
            message: 'Server error'
        });
        return;
    }
    


}