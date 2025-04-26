import prisma from '../../common/utils/prisma';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { createToken } from "../utils/createToken";


export async function refreshController(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken
    console.log("Refresh token in refresh",refreshToken)

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is missing' });
        return
    }

    try {
        const payload:any = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
        const email = payload.email
        const accessToken = createToken(payload.userId, payload.email, process.env.ACCESS_SECRET!, 10)
        console.log("access token =>",accessToken)
        await prisma.token.update({
            where: {
                email
            },
            data: {
                accessToken
            }
        })
        res.status(200).json({
            status: 'success',
            message: 'Access token sent successful',
            accessToken,
            data: {
                email
            }
        });

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Refresh token has expired' });
            // Tekrar sign in olmali
        } else {
            res.status(403).json({ message: 'Invalid refresh token' });
        }
    }
}