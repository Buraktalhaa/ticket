import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function editCategory(req:Request, res:Response){
    const {categoryName, newCategoryName } = req.body

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })

    if(!category){
        handleError(res,`Category doesn't exists: ${categoryName}`, 400)
        return;
    }

    const newCategory = await prisma.category.update({
        where:{
            id:category.id
        },
        data:{
            name:newCategoryName
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Category edited succesfully',
    });
    return;
}