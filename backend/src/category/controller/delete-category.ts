import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function deleteCategory(req: Request, res: Response) {
    const { id } = req.body;

    if (!id || typeof id !== 'string') {
        handleError(res, "Category ID is required and must be a string", 400);
        return
    }

    try {
        const category = await prisma.category.findUnique({
            where: {
                id
            }
        });

        if (!category) {
            handleError(res, "Category not found", 404);
            return
        }

        await prisma.category.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: `Category '${category.name}' deleted successfully`,
        });
    } catch (error) {
        handleError(res, "Failed to delete category", 500);
    }
}
