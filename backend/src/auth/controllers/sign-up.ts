import { Request, Response } from 'express';
import { checkSignUp } from './checkSignUp';
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcrypt'
import { createToken } from '../utils/createToken';
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handleError';



export async function signUpController(req: Request, res: Response) {
    const {role} = req.body

    if(role === 'seller'){
        handleError(res, "You can't create seller", 400)
        return;
    }

    const findUserRole = await prisma.role.findUnique({
        where: {
            name: role
        }
    })

    if (!findUserRole) {
        handleError(res, 'Profile type user not created', 400)
        return
    }

    if (checkSignUp(req) === false) {
        handleError(res, 'Email, name and password are required', 400)
        return
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { email, firstName } = req.body;

    const existingUSer = await prisma.auth.findUnique(
        {
            where: {
                email
            }
        });

    if (existingUSer) {
        handleError(res, 'There is a user with this email address', 400)
        return;
    }

    // Create Auth
    const newAuth = await prisma.auth.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    // Create User
    const user = await prisma.user.create({
        data: {
            firstName,
            lastName: '',
            birthday: '',
            active: true,
            email
        }
    })
    const userId = user.id

    const accessToken = createToken(userId, email, process.env.ACCESS_SECRET!, 10 * 60 * 24)
    const refreshToken = createToken(userId, email, process.env.REFRESH_SECRET!, 48 * 60 * 60)

    // Create Token
    await prisma.token.create({
        data: {
            accessToken,
            refreshToken,
            userId
        }
    })

    const userRole = await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: findUserRole?.id
        }
    })


    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Sign up successful',
        accessToken,
        refreshToken,
        data: {
            email: newAuth.email,
        }
    });
}