import prisma from '../../common/utils/prisma';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { createToken } from "../utils/create-token";
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handle-error';
import { TokenPayload } from '../../common/types/token.type';

export async function refreshController(req: Request, res: Response) {
    const { refreshToken } = req.body.refreshToken
    console.log("Refresh token in refresh", refreshToken)

    if (!refreshToken) {
        handleError(res, 'Refresh token is missing', 401)
        return
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as TokenPayload;
        const userId = payload.userId

        // Create new access token
        const accessToken = createToken(payload.userId, payload.email, 'user', process.env.ACCESS_SECRET!, 15 * 60 * 24);

        // Token update in db
        await prisma.token.update({
            where: {
                userId
            },
            data: {
                accessToken
            }
        })
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Access token sent successful',
            accessToken,
            data: { userId }
        });
        return
    }
    catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            handleError(res, 'Refresh token has expired', 401);
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            handleError(res, 'Invalid refresh token', 401);
            return;
        } else {
            handleError(res, 'Internal server error', 500);
            return;
        }
    }
}