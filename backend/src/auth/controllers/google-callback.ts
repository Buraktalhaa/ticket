import { Request, Response } from "express";
import { createToken } from "../utils/create-token";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function googleCallback(req: Request, res: Response) {
    const { id, email } = req.user as { id: string; email: string };

    try {
        if (!req.user || !id || !email) {
            handleError(res, 'Invalid user information from Google', 400)
            return
        }

        const accessToken = createToken(id, email, 'user', process.env.ACCESS_SECRET!, 10 * 60 * 24);
        const refreshToken = createToken(id, email, 'user', process.env.REFRESH_SECRET!, 48 * 60 * 60);

        await prisma.token.upsert({
            where: {
                userId: id
            },
            update: {
                accessToken, 
                refreshToken,
                updatedAt: new Date()

            },
            create: {
                userId: id,
                accessToken,
                refreshToken,
                updatedAt: new Date()
            }
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: "Google login successful",
            accessToken,
            refreshToken,
            data: { email }
        });
        return

    } catch (err) {
        handleError(res, "Token creation failed", 500)
        return
    }
}