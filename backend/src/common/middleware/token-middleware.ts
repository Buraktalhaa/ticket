import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';
import { handleError } from "../error-handling/handle-error";

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {

    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) {
        handleError(res, 'Access token is missing', 401)
        return
    }

    try {
        const { exp, iat, ...rest } = jwt.verify(token, process.env.ACCESS_SECRET!) as TokenPayload

        req.user = rest
        next();

    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            handleError(res, 'Token expired', 401);
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            handleError(res, `Invalid token: ${error.message}`, 401);
            return;
        }
        handleError(res, 'Authentication failed', 401);
        return
    }
}