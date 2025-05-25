import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
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
        res.status(404).json({
        status: ResponseStatus.FAIL,
        message: "Ticket not found.",
      });
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
    res.status(500).json({
      status: ResponseStatus.FAIL,
      message: "An error occurred while fetching the ticket.",
    });
    return
  }
}
