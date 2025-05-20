import { Request, Response } from "express";
import { createToken } from "../utils/create-token";
import prisma from "../../common/utils/prisma";

export async function googleCallback(req: Request, res: Response) {
    const { id, email } = req.user as { id: string; email: string };

    try {
        const accessToken = createToken(id, email, 'user', process.env.ACCESS_SECRET!, 10 * 60 * 24);
        const refreshToken = createToken(id, email, 'user', process.env.REFRESH_SECRET!, 48 * 60 * 60);

        await prisma.token.upsert({
            where: {
                userId: id
            },
            update: {
                accessToken, 
                refreshToken
            },
            create: {
                userId: id,
                accessToken,
                refreshToken,
                updatedAt: new Date()
            }
        });

        res.status(200).json({
            status: "success",
            message: "Google login successful",
            accessToken,
            refreshToken,
            data: {
                email
            }
        });
        return

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Token creation failed",
            error: err
        });
        return
    }
}
