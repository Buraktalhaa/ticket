import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import redis from "../..//common/utils/redis";

export async function getTickets(req: Request, res: Response) {
  const cacheKey = "tickets:available";
  
  const cachedTickets = await redis.get(cacheKey)
  
  if (cachedTickets) {
    res.status(200).json({
      status: ResponseStatus.SUCCESS,
      message: 'All tickets from cache',
      data: JSON.parse(cachedTickets),
    });
    return
  }

  const allTickets = await prisma.ticket.findMany({
    where: {
      sold: {
        not: true
      }
    }
  })

  await redis.set(cacheKey, JSON.stringify(allTickets),  'EX', 60 );

  res.status(200).json({
    status: ResponseStatus.SUCCESS,
    message: 'All tickets',
    data: allTickets
  });
  return;
}
