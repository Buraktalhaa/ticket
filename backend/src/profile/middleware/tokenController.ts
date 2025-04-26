import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {

    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access token is missing' });
        return
    }
    console.log("Access Token =>", token)


    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as any;
        (req as any).user = decoded;
        console.log('Decoded Token:', decoded);
        next();

    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};

