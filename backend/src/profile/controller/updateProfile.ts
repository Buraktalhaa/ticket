import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from "../../common/enums/status.enum";
import { handleError } from "../../common/error-handling/handleError";

export async function updateProfile(req: Request, res: Response) {
    try {
        // Token icindeki email i al
        const decoded = req.user
        
        const email = decoded?.email
        const { name, surname, birthday, active } = req.body
        
        const updatedUser = await prisma.user.update({
            where: {
                email
            },
            data: {
                name,
                surname,
                birthday,
                active,
            }
        })

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Profile updated successfully',
            data: updatedUser,
        });
        return;
    } catch (error) {
        handleError(res,'Error updating profile', 500)
        return
    }
}