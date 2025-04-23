import { Request } from 'express';

export function checkSignUp(req: Request) {
    if (!req.body || !req.body.email || !req.body.password || !req.body.name) {
        return false;
    }
    else{
        return true;
    }
}
