import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function getTickets(req:Request, res:Response){
    const allTickets = await prisma.ticket.findMany({
        where: {
          sold:{
            not:true
          }
          },
          include: {
            category: true
          }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'ticket created succesfully',
        data: allTickets
    });
    return;
}

// bu kod where icine eklenicek ve tum datalar dondurulmeyecek.
// bu sadece postman icin yapildi.
//            status: {
//     not: "processing"
// },
