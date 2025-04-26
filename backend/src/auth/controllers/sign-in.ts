import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcrypt'
import { checkSignIn } from "./checkSignIn";
import { createToken } from "../utils/createToken";

export async function signInController(req: Request, res: Response) {
    if (checkSignIn(req) === false) {
        res.status(400).json({
            status: 'fail',
            message: 'Email and password are required'
        })
        return;
    }

    const email = req.body.email;
    console.log(email)

    const auth = await prisma.auth.findUnique(
        {
            where: {
                email
            }
        }
    )

    if (!auth) {
        res.status(400).json({
            status: 'fail',
            message: 'Auth not found'
        });
        return
    }

    const user = await prisma.user.findUnique(
        {
            where: {
                email
            }
        }
    )
    if (!user) {
        res.status(400).json({
            status: 'fail',
            message: 'User not found'
        });
        return;
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, auth.password);
    if (!isPasswordValid) {
        res.status(400).json({
            status: 'fail',
            message: 'Incorrect password'
        });
        return
    }

    if (!process.env.ACCESS_SECRET && !process.env.REFRESH_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const accessToken = createToken(user.id, email, process.env.ACCESS_SECRET!, 10)
    const refreshToken = createToken(user.id, email, process.env.REFRESH_SECRET!, 24 * 60 * 60)

    console.log("Access Token in sign-in =>", accessToken)

    const existingToken = await prisma.token.findFirst({
        where:
            { email: auth.email }
    });

    await prisma.token.update({
        where: { email: auth.email },
        data: {
            accessToken,
            refreshToken,
            createdAt: new Date()
        }
    });



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