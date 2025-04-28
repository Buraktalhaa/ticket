import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ResponseStatus } from "../../common/enums/status.enum";

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {

    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (!token) {
        res.status(401).json({ 
            status: ResponseStatus.FAIL,
            message: 'Access token is missing' });
        return
    }

    try {
        const {exp,iat,...rest} = jwt.verify(token, process.env.ACCESS_SECRET!) as any;
        req.user = rest
        next();

    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ 
                status: ResponseStatus.FAIL,
                message: 'Token expired' });
            return;
        }
        res.status(401).json({ 
            status: ResponseStatus.FAIL,
            message: 'Invalid token: ${err.message}'});
        return;
    }
};

