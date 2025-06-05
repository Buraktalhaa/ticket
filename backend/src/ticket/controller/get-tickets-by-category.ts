import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/type/request.type";

export async function getTicketsByCategory(req: Request, res: Response) {
  const categoryName = req.params.category;
  const userId = (req.user as DecodedUser)?.userId || null;

  try {
    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      res.status(404).json({
        status: ResponseStatus.FAIL,
        message: "Category not found",
      });
      return
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        sold: false,
        status: "approve",
        category: {
          name: categoryName,
        },
      },
      include: {
        category: true,
        company: true,
        user: true,
        Favorites: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                id: true, 
              },
            }
          : false, 
      },
    });

    const ticketsWithFavorite = tickets.map((ticket) => ({
      ...ticket,
      isFavorite: ticket.Favorites && ticket.Favorites.length > 0,
    }));

    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      message: `Tickets for category: ${categoryName}`,
      data: ticketsWithFavorite,
    });
    return
  } catch (error) {
    console.error("Error fetching tickets by category:", error);
    res.status(500).json({
      status: ResponseStatus.FAIL,
      message: "An error occurred while fetching tickets.",
    });
    return
  }
}
