import jwt from 'jsonwebtoken';

export function createToken(userId:string, email: string, role:string, secretKey:string, expiredIn:number) {
    return jwt.sign(
        { userId, email, role }, 
        secretKey!, 
        { algorithm: 'HS256', expiresIn:expiredIn }
    );
};
