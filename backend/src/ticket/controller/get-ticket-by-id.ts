import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function getTicketById(req: Request, res: Response) {
  const id = req.params.id;
  console.log("id", id);

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

    const { categoryId, companyId, createdAt, pnr, ...cleanedTicket } = ticket;

    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      message: "Ticket fetched successfully.",
      data: cleanedTicket,
    });
    return
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    handleError(res, 'An error occurred while fetching the ticket.', 500)
    return
  }
}
