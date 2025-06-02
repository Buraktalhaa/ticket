import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function deleteCategory(req:Request, res:Response){
    const {id} = req.body;

    const category = await prisma.category.findUnique({
        where:{
            id
        }
    })

    if(!category){
        handleError(res, "There is no such category", 400)
        return;
    }

    await prisma.category.delete({
        where: {
            id
        }
    });

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: 'Category deleted succesfully',
    });
    return;
}