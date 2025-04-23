import { Request, Response } from 'express';
import { checkSignUp } from './checkSignUp';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export async function signUpController(req: Request, res: Response) {

    if (checkSignUp(req) === false) {
        res.status(400).json({
            status: 'fail',
            message: 'Email, name and password are required'
        })
        return
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { email, name } = req.body;


    const existingUSer = await prisma.user.findUnique(
        {
            where: {
                email: email
            }
        });
    if (existingUSer) {
        res.status(400).json({
            status: 'fail',
            message: 'There is a user with this email address'
        })
    }
    else {
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password:hashedPassword
            }
        });
        console.log("New User created:", newUser);
    }


    res.status(200).json({
        status: 'success',
        message: 'Sign up successful',
        data: {
            email,
            name,
        }
    });
}
