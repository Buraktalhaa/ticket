import { Request, Response } from "express";
import { handleError } from "../../common/error-handling/handleError";
import jwt from 'jsonwebtoken';
import prisma from "../../common/utils/prisma";
import bcrypt from 'bcryptjs'

export async function resetPasswordController(req: Request, res: Response) {
    const token = req.params.token;
    const { password, confirmPassword } = req.body

    // password check
    if (password !== confirmPassword) {
        handleError(res, "Password not equal to confirmPassword", 400);
        return
    }
    let payload: any;

    try {
        payload = jwt.verify(token, process.env.ACCESS_SECRET!)
    } catch (error) {
        handleError(res, "Invalid token.", 400)
        return;
    }

    const { email, userId } = payload

    // find token in db
    const findResetToken = await prisma.passwordResetToken.findUnique({
        where: {
            userId
        }
    })

    if (!findResetToken || findResetToken?.used === true || findResetToken.expiresAt < new Date()) {
        handleError(res, "Url already used.", 400);
        return;
    }

    const auth = await prisma.auth.findUnique({
        where: {
            email,
        }
    });

    if (!auth) {
        handleError(res, "User not found", 404);
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.auth.update({
        where: {
            email
        },
        data: {
            password: hashedPassword,
        }
    })

    // update reset Token in db
    await prisma.passwordResetToken.update({
        where: {
            userId
        },
        data: {
            used: true
        }
    })

    res.status(200).json({
        message: "Password changed",
    });
    return;
}