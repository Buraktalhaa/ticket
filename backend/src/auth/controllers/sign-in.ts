import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcryptjs'
import { checkSignIn } from "../utils/check-sign-in";
import { createToken } from "../utils/create-token";
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handle-error";

export async function signInController(req: Request, res: Response) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        if (checkSignIn(req) === false) {
            handleError(res, 'Please enter your email and password.', 400);
            return;
        }

        const auth = await prisma.auth.findUnique({ where: { email }})

        if (!auth) {
            handleError(res, 'No account found with this email address.', 401);
            return
        }

        const user = await prisma.user.findUnique({ where: { email }})

        if (!user) {
            handleError(res, 'User information not found. Please try again.', 401);
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, auth.password);
        if (!isPasswordValid) {
            handleError(res, 'The password you entered is incorrect. Please try again.', 401);
            return
        }

        if (!process.env.ACCESS_SECRET && !process.env.REFRESH_SECRET) {
            handleError(res, 'Server configuration error: security keys are missing.', 500);
            return
        }

        const userRole = await prisma.userRole.findUnique({
            where: { userId: user.id },
            include: { role: true }});

        const role = userRole?.role.name;

        if (!role) {
            handleError(res, 'Unable to determine user role. Please contact support.', 500);
            return
        }

        const accessToken = createToken(user.id, email, role, process.env.ACCESS_SECRET!, 4800 * 60 * 24)
        const refreshToken = createToken(user.id, email, role, process.env.REFRESH_SECRET!, 24 * 60 * 60)

        await prisma.token.update({
            where: { userId: user.id },
            data: {
                accessToken,
                refreshToken,
                createdAt: new Date()
            }
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Sign in successful. Welcome back!',
            accessToken,
            refreshToken,
            data: { email }
        })
        return
    }
    catch (error) {
        handleError(res, 'An unexpected error occurred during sign-in. Please try again later.', 500);
        return
    }
}