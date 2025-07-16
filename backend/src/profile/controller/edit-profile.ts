import { Request, Response } from "express";
import prisma from '../../common/utils/prisma';
import { ResponseStatus } from "../../common/enums/status.enum";
import fs from "fs"
import { DecodedUser } from "../../common/types/request.type";
import { handleError } from "../../common/error-handling/handle-error";

export async function editProfile(req: Request, res: Response) {
  try {
    const { userId } = req.user as DecodedUser;

    const findOldPhoto = await prisma.user.findUnique({
      where: { id: userId }
    })

    const oldPhoto = findOldPhoto?.profilPhotoUrl;
    const newPhoto = req.file?.filename;

    if (newPhoto) {
      if (oldPhoto) {
        const filePath = `/Users/burak/Desktop/projeler/ticket/backend/src/uploadPhotos/${oldPhoto}`;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Old photo deletion error:', err);
            } else {
              console.log('Old photo deleted successfully');
            }
          });
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        ...req.body,
        profilPhotoUrl: newPhoto || oldPhoto

      }
    })

    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
    return;

  } catch (error) {
    handleError(res, 'Failed to update profile', 500);
    return
  }
}