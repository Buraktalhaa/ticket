import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from '../../common/type/request.type';
import { ResponseStatus } from "../../common/enums/status.enum";

export async function deleteCart(req: Request, res: Response) {
  const { userId } = req.user as DecodedUser;

  try {
    await prisma.cart.delete({
      where: {
        userId
      }
    });

    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      message: 'Cart deleted successfully'
    });
    return
  } catch (error) {
    handleError(res, 'Error deleting cart', 404);
    return
  }
}