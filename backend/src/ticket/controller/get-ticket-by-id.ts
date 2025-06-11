import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/types/request.type";

export async function getTicketById(req: Request, res: Response) {
  const id = req.params.id;
  const userId = (req.user as DecodedUser)?.userId || null;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
        sold: false,
        status: "approve",
      },
      include: {
        category: true,
        company: true,
        user: true,
      },
    });

    if (!ticket) {
      handleError(res, 'Ticket not found.', 400)
      return
    }

    let isFavorite = false;
    if (userId) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_ticketId: {
            userId: userId,
            ticketId: id,
          }
        }
      });
      isFavorite = !!favorite;
    }

    const { categoryId, companyId, createdAt, pnr, ...cleanedTicket } = ticket;

    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      data: {
        ...cleanedTicket,
        isFavorite,
      }
    });
    return

  } catch (error) {
    handleError(res, 'An error occurred while fetching the ticket.', 500)
    return
  }
}