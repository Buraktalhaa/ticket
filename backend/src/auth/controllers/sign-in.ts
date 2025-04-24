import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import { checkSignIn } from "./checkSignIn";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

function createToken(id:string, secretKey:string) { //expiresIn: string
    return jwt.sign(
        { userId: id }, 
        secretKey!, 
        { algorithm: 'HS256', expiresIn:"1h" }
    );
};


export async function signInController(req: Request, res: Response) {
    if (checkSignIn(req) === false) {
        res.status(400).json({
            status: 'fail',
            message: 'Email and password are required'
        })
        return;
    }

    const email = req.body.email;

    const user = await prisma.auth.findUnique(
        {
            where: {
                email: email
            }
        }
    )

    if (!user) {
        res.status(400).json({
            status: 'fail',
            message: 'User not found'
        });
        return
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({
            status: 'fail',
            message: 'Incorrect password'
        });
        return
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const accessToken = createToken(user.id, process.env.ACCESS_SECRET!)
    const refreshToken = createToken(user.id, process.env.REFRESH_SECRET!)

    const existingToken = await prisma.token.findFirst({
        where: { authId: user.id }
    });

    if (existingToken) {
        await prisma.token.updateMany({
            where: { authId: user.id },
            data: {
                accessToken,
                refreshToken,
                createdAt: new Date()
            }
        });
    } else {
        await prisma.token.create({
            data: {
                accessToken,
                refreshToken,
                authId: user.id
            }
        });
    }


    console.log("Sing in successfull")
    res.status(200).json({
        status: "success",
        message: "Sign in succesfull",
        accessToken,
        refreshToken,
        data: {
            email
        }
    })
}