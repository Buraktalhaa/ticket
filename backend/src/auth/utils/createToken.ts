import jwt from 'jsonwebtoken';

export function createToken(userId:string, email: string, secretKey:string, expiredIn:number) {
    return jwt.sign(
        { userId, email }, 
        secretKey!, 
        { algorithm: 'HS256', expiresIn:expiredIn }
    );
};
