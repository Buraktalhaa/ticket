import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from '../../common/types/request.type';
import { ResponseStatus } from "../../common/enums/status.enum";

export async function deleteCart(req: Request, res: Response) {
  const { userId } = req.user as DecodedUser;

  try {
    const deleteResult =  await prisma.cart.delete({
      where: {
        userId
      }
    });

    if (deleteResult.count === 0) {
      handleError(res, 'Cart is already empty or not found', 404);
      return
    }

    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      message: 'Cart deleted successfully'
    });
    return

  } catch (error) {
    handleError(res, 'Error deleting cart', 500);
    return
  }
}