import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from "../../common/types/request.type";
import { ResponseStatus } from "../../common/enums/status.enum";

// email ve yeni password u frontdan al

export async function editPassword(req: Request, res: Response) {
    try {
        const decoded = req.user as DecodedUser;
        const email = decoded.email;
        const oldPassword = req.body.password

        if (!decoded || !decoded.email) {
            handleError(res, 'User email not found in token', 400)
            return 
        }

        // find user
        const user = await prisma.auth.findUnique({ where: { email } });

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
            where: { email },
            data: { password: hashedNewPassword }
        })

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Password changed successfully',
            data: { email } 
        });
        return
        
    } catch (error) {
        handleError(res, 'An error occurred while changing the password. Please try again later.', 500)
        return
    }
}