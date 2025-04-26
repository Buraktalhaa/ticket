import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';

export async function updateProfile(req: Request, res: Response) {
    try {
        // Token icindeki email i al
        const decoded = (req as any).user
        const email = decoded.email
        const { name, surname, birthday, active } = (req as any).body
        console.log(name, surname, birthday, active)
        
        const updatedUser = await prisma.user.update({
            where: {
                email
            },
            data: {
                name: name,
                surname: surname,
                birthday: birthday,
                active: active,
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