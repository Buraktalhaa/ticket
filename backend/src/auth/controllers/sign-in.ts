import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcryptjs'
import { checkSignIn } from "../utils/check-sign-in";
import { createToken } from "../utils/create-token";
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handle-error";

export async function signInController(req: Request, res: Response) {
    if (checkSignIn(req) === false) {
        handleError(res, 'Email and password are required', 400)
        return;
    }

    const email = req.body.email;
    const password = req.body.password;

    const auth = await prisma.auth.findUnique(
        {
            where: {
                email
            },
    
        }
    )

    if (!auth) {
        handleError(res, 'Auth not found', 400)
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
        handleError(res, 'User not found', 400)
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
        handleError(res, 'Incorrect password', 400)
        return
    }

    if (!process.env.ACCESS_SECRET && !process.env.REFRESH_SECRET) {
        handleError(res, "JWT_SECRET is not defined in environment variables", 400)
        return
    }

    const userRole = await prisma.userRole.findUnique({
        where: { userId: user.id },
        include: {
            role: true
        }
    });

    const role = userRole?.role.name;

    if (!role) {
        handleError(res, 'Role cant find', 400)
        return
    }

    const accessToken = createToken(user.id, email, role, process.env.ACCESS_SECRET!, 100)
    const refreshToken = createToken(user.id, email, role, process.env.REFRESH_SECRET!, 24 * 60 * 60)

    await prisma.token.update({
        where: { userId: user.id },
        data: {
            accessToken,
            refreshToken,
            createdAt: new Date()
        }
    });


    console.log("Sing in successfull")
    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: "Sign in succesfull",
        accessToken,
        refreshToken,
        data: {
            email
        }
    })
    return
}