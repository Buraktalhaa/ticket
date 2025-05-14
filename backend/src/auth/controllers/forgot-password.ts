import { Request, Response } from "express";
import { handleError } from "../../common/error-handling/handleError";
import { Email } from "../../common/utils/email";
import prisma from "../../common/utils/prisma";
import { createToken } from "../utils/createToken";

export async function forgotPasswordController(req: Request, res: Response) {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            handleError(res, 'Auth not found', 400)
            return
        }

        const oldToken = await prisma.passwordResetToken.findUnique({
            where: {
                userId: user.id
            }
        })

        const token = createToken(user.id, email, process.env.ACCESS_SECRET!, 10 * 60 * 1000)

        if (oldToken && oldToken.expiresAt < new Date()) {
            
            await prisma.passwordResetToken.update({
                where: {
                    userId: user.id
                },
                data: {
                    token,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    used: false
                }
            })
        }

        else if (oldToken && oldToken.expiresAt >= new Date()) {
            handleError(res, 'Clicked in 10 minutes', 400)
            return;

        } else {
            await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                }
            })
        }

        const mail = new Email({ email, firstName: user.firstName }, `http://localhost:4200/reset-password/${token}`);
        await mail.send('Subject', 'forgot Password?');

        res.status(200).json({
            message: "Welcome email sent successfully",
        });
        return;
    }
    catch (error) {
        handleError(res, "Failed to send email", 500)
        console.error(error);
        return;
    }
}