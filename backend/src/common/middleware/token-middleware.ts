import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { handleError } from "../error-handling/handle-error";
import { TokenPayload } from '../types/token.type';

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];
        
        if (!token) {
            handleError(res, 'Access token is missing', 401)
            return
        }

        const { exp, iat, ...rest } = jwt.verify(token, process.env.ACCESS_SECRET!) as TokenPayload;
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