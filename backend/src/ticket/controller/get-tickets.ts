import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function getTickets(req: Request, res: Response) {

  const allTickets = await prisma.ticket.findMany({
    where: {
      sold: {
        not: true
      },
      status:{
        equals:"approve"
      }
    }
  })

  res.status(200).json({
    status: ResponseStatus.SUCCESS,
    message: 'All tickets',
    data: allTickets
  });
  return;
}
