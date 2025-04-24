import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {


    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if(!token){
        res.status(401).json({ message: 'Access token is missing' });
        return 
    }
    
    try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET!) as {userId:string};
        (req as any).user = { userId: payload.userId };
        next();


    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired access token' });
        return 
    }
 }

