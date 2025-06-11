import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function editCategory(req: Request, res: Response) {
    const { categoryName, newCategoryName } = req.body

    if (!categoryName || !newCategoryName) {
        handleError(res, "Both categoryName and newCategoryName are required.", 400);
        return
    }

    try {

        const category = await prisma.category.findUnique({
            where: {
                name: categoryName
            }
        })

        if (!category) {
            handleError(res, `Category doesn't exists: ${categoryName}`, 404)
            return;
        }

        const existingNewCategory = await prisma.category.findUnique({
            where: {
                name: newCategoryName
            }
        });

        if (existingNewCategory && existingNewCategory.id !== category.id) {
            handleError(res, `New category name '${newCategoryName}' already exists.`, 409);
            return
        }

        await prisma.category.update({
            where: {
                id: category.id
            },
            data: {
                name: newCategoryName
            }
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Category edited succesfully',
        });
        return;

    } catch (error) {
        handleError(res, "An unexpected error occurred while editing the category.", 500);
        return
    }
}