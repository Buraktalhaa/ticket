import { Request, Response } from 'express';
import { checkSignUp } from '../utils/check-sign-up';
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcryptjs'
import { createToken } from '../utils/create-token';
import { ResponseStatus } from '../../common/enums/status.enum';
import { handleError } from '../../common/error-handling/handle-error';

export async function signUpController(req: Request, res: Response) {
    try {
        const { email, firstName } = req.body;

        const findUserRole = await prisma.role.findUnique({ where: {name: 'user'}})

        if (!findUserRole) {
            handleError(res, 'User role not found in the system', 500);
            return
        }

        if (!(checkSignUp(req))) {
            handleError(res, 'Email, name and password are required', 400)
            return
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Find out if the user exists
        const existingUser = await prisma.user.findUnique({ where: { email }});

        if (existingUser) {
            const auth = await prisma.auth.findUnique({ where: { email }})

            const googleAuth = await prisma.googleAuth.findUnique({ where: { userId: existingUser.id }})

            if (auth) {
                handleError(res, 'There is a user with this email address', 409)
                return;
            }
            
            if (googleAuth) {
                if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
                    handleError(res, "JWT_SECRET is not defined in environment variables", 500);
                    return
                }

                const accessToken = createToken(existingUser.id, email, 'user', process.env.ACCESS_SECRET!, 4800 * 60 * 24)
                const refreshToken = createToken(existingUser.id, email, 'user', process.env.REFRESH_SECRET!, 48 * 60 * 60)

                // new Auth
                const auth = await prisma.auth.create({
                    data: {
                        email: existingUser.email,
                        password: hashedPassword
                    }
                });

                // tokens update
                await prisma.token.update({
                    where: {
                        userId: existingUser.id
                    },
                    data: {
                        accessToken,
                        refreshToken
                    }
                })
                res.status(200).json({
                    status: ResponseStatus.SUCCESS,
                    message: 'Sign up successful',
                    accessToken,
                    refreshToken,
                    data: { email: auth.email }
                });
                return
            }
        }

        if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
            handleError(res, "JWT_SECRET is not defined in environment variables", 500);
            return
        }

        // Create User
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName: '',
                active: true,
                email
            }
        })

        const userId = user.id

        const accessToken = createToken(userId, email, 'user', process.env.ACCESS_SECRET!, 100 * 60 * 24)
        const refreshToken = createToken(userId, email, 'user', process.env.REFRESH_SECRET!, 48 * 60 * 60)


        // Create Auth
        const newAuth = await prisma.auth.create({
            data: {
                email: user.email,
                password: hashedPassword
            }
        });

        // Create Token
        await prisma.token.create({
            data: {
                accessToken,
                refreshToken,
                userId
            }
        })

        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: findUserRole?.id
            }
        })

        res.status(201).json({
            status: ResponseStatus.SUCCESS,
            message: 'Sign up successful',
            accessToken,
            refreshToken,
            data: { email: newAuth.email }
        });
        return
        
    } catch (error) {
        handleError(res, 'An unexpected error occurred during sign-up', 500);
        return
    }
}