import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import prisma from "../../common/utils/prisma";


// email ve yeni password u frontdan al

export async function updatePassword(req: Request, res: Response) {
    try {
        const decoded = (req as any).user;
        const email = decoded.email;
        const oldPassword = req.body.password

        // find user
        const user = await prisma.auth.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
            return;
        }

        // check password 
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordValid){
            res.status(404).json({
                status: 'error',
                message: 'Password wrong.'
            });
            return
        }

        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

        await prisma.auth.update({
            where: {
                email
            },
            data: {
                password: hashedNewPassword
            }
        })

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully',
            data: {
                email
            }
        });
    } catch (error) {
        console.error('Error changing password:', error)

        res.status(500).json({
            status: 'error',
            message: 'An error occurred while changing the password. Please try again later.'
        });
    }

}
