import { Request } from "express";

export function checkSignIn(req: Request){
    if(!req.body || !req.body.email || !req.body.password){
        return false;
    }
    else{
        return true;
    }
}