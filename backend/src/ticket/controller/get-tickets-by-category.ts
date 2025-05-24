import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { log } from "console";

export async function getTicketsByCategory(req: Request, res: Response) {

    const categoryName = req.params.category;

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })
    
    try {
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
            },
          });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: `Tickets for category: ${categoryName}`,
            data: tickets,
        });
    } catch (error) {
        console.error("Error fetching tickets by category:", error);
        res.status(500).json({
            status: ResponseStatus.FAIL,
            message: "An error occurred while fetching tickets.",
        });
    }
}