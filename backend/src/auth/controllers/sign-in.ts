import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import { checkSignIn } from "./checkSignIn";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function signInController(req: Request, res: Response) {
    if (checkSignIn(req) === false) {
        res.status(400).json({
            status: 'fail',
            message: 'Email and password are required'
        })
    }



    const email = req.body.email;

    const user = await prisma.user.findUnique(
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

    const secret = process.env.JWT_EXPIRES_IN!;

    // TOKEN
    const token = jwt.sign(
        { userId: user.id },process.env.JWT_SECRET!, {
            algorithm: 'RS256',
            expiresIn: '1h'
        });




    console.log("Sing in successfull")
    res.status(200).json({
        status: "success",
        message: "Sign in succesfull",
        token,
        data: {
            email
        }
    })
}