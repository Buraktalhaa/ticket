import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function getTicketsByCategory(req: Request, res: Response) {

    const categoryName = req.params.category;
    console.log(categoryName);

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
                category:true,
                company: true,
                user: true,

            },
            omit:{
                categoryId:true,
                companyId:true,
                createdAt:true,
                pnr:true,
            }
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
