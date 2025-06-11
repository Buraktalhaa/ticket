import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/token.type";

export function authenticateOptionalJWT(req: Request, res: Response, next: NextFunction) {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if(!token){
        next()
        return 
    }

    try {
        const { exp, iat, ...rest }= jwt.verify(token, process.env.ACCESS_SECRET!) as TokenPayload;
        req.user = rest;
        next();
    } catch (err) {
        next();
        return 
    }
}