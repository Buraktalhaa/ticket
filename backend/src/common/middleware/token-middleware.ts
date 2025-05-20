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
        const { exp, iat, ...rest } = jwt.verify(token, process.env.ACCESS_SECRET!) as any;
        req.user = rest
        next();

    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            handleError(res, 'Token expired', 401)
            return;
        }
        handleError(res, `Invalid token: ${err.message}`, 401)
        return;
    }
};

