import { Request, Response } from 'express';
import prisma from '../../common/utils/prisma';

export async function getProfile(req:Request, res: Response) {
    try {
        const decoded = (req as any).user;
        const email = decoded.email

        console.log("email",email)

        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include:{

            }
        })
    
        if (!user) {
            res.status(404).json({
                message: 'User not found',
            });
            return;
        }
    
        res.status(200).json({
            message: "your profile",
            email: email,
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