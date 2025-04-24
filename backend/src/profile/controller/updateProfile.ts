import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateProfile(req: Request, res: Response) {
    try {

        const authId = (req as any).user.userId;

        const { name, surname, birthday, active } = req.body;
        const updatedUser = await prisma.user.update({
            where: {
                authId: authId
            },
            data: {
                name: name,
                surname: surname,
                birthday: birthday,
                active: active

            }
        })

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedUser,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: 'Error updating profile',
        });
        return
    }



}