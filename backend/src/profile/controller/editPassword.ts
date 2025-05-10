import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handleError";
import { DecodedUser } from "../../common/type/request.type";

// email ve yeni password u frontdan al

export async function editPassword(req: Request, res: Response) {
    try {
        const decoded = req.user as DecodedUser;;

        if (!decoded || !decoded.email) {
            handleError(res, 'User email not found in token', 400)
            return 
        }
        
        const email = decoded.email;
        const oldPassword = req.body.password

        // find user
        const user = await prisma.auth.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            handleError(res, 'User not found', 400)
            return;
        }

        // check password 
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordValid){
            handleError(res, 'Password wrong.', 401)
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
        handleError(res, 'An error occurred while changing the password. Please try again later.', 500)
    }
}