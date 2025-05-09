import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from "../../common/enums/status.enum";
import fs from "fs"
import redis from "../../common/utils/redis";
import { setToRedis } from "../../common/utils/redisGetSet";

export async function updateProfile(req: Request, res: Response) {
        const userId = req.user?.userId        

        const findOldPhoto = await prisma.user.findUnique({
            where: {
                id:userId
            }
        })  

        const oldPhoto = findOldPhoto?.photoName

        const filePath = `/Users/burak/Desktop/projeler/ticket/backend/src/uploadPhotos/${oldPhoto}` //FIXME:

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Old photo deleted succesfully');
                }
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id:userId
            },
            data: {
                ...req.body,
                photoName: req.file?.filename
            }
        })

        setToRedis(`user:profile:${userId}`, JSON.stringify(updatedUser), 600)

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Profile updated successfully',
            data: updatedUser,
        });
        return;
}