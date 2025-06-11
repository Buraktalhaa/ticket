import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/type/request.type";
import { handleError } from "../../common/error-handling/handle-error";

export async function getTickets(req: Request, res: Response) {
  const userId = (req.user as DecodedUser)?.userId || null;

  try {
    const allTickets = await prisma.ticket.findMany({
      where: {
        sold: { not: true },
        status: { equals: "approve" }
      },
      include: {
        Favorites: userId
          ? {
              where: { userId: userId },
              select: { id: true  }
            }
          : false,
        category: {
          select: { name: true }
        }
      },
      omit: {
        categoryId: true,
        companyId: true,
        pnr: true,
      }
    })
  
    const ticketsWithFavorite = allTickets.map((ticket) => ({
      ...ticket,
      isFavorite: ticket.Favorites && ticket.Favorites.length > 0,
    }));
  
    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      data: ticketsWithFavorite
    });
    return;

  } catch (error) {
    handleError(res, "An error occurred while fetching tickets.", 500);
    return
  }
}