import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function createCategory(req: Request, res: Response) {
    const { categoryName } = req.body

    if (!categoryName || typeof categoryName !== 'string') {
        handleError(res, 'Category name is required and must be a string', 400);
        return
    }

    try {
        const existingCategory = await prisma.category.findUnique({
            where: {
                name: categoryName
            }
        })

        if (existingCategory) {
            handleError(res, `Category already exists: ${categoryName}`, 400);
            return;
        }

        await prisma.category.create({
            data: {
                name: categoryName
            }
        })

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: `A category named ${categoryName}  created succesfully`,
        });
        return;
    } catch (error) {
        handleError(res, 'Failed to create category', 500);
    }
}