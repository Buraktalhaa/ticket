import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/type/request.type";

export async function getTickets(req: Request, res: Response) {
  const userId = (req.user as DecodedUser)?.userId || null;
  
  const allTickets = await prisma.ticket.findMany({
    where: {
      sold: {
        not: true
      },
      status: {
        equals: "approve"
      }
    },
    include: {
      category: {
        omit: {
          id: true
        }
      }
    },
    omit: {
      categoryId: true,
      companyId: true,
      pnr: true,
    }
  })

  let favoriteTicketIds: string[] = [];
  if (userId) {
    const favorites = await prisma.favorite.findMany({
      where: { 
        userId: userId 
      },
      select: { 
        ticketId: true 
      },
    });
    favoriteTicketIds = favorites.map((fav) => fav.ticketId);
  }

  const ticketsWithFavorite = allTickets.map((ticket) => ({
    ...ticket,
    isFavorite: favoriteTicketIds.includes(ticket.id),
  }));


  res.status(200).json({
    status: ResponseStatus.SUCCESS,
    message: 'All tickets',
    data: ticketsWithFavorite
  });
  return;
}