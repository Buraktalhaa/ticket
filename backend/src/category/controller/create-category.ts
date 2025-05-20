import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handle-error";
import { DecodedUser } from "../../common/type/request.type";
import { ResponseStatus } from "../../common/enums/status.enum";

export async function createCategory(req:Request, res:Response){
    const {userId, email} = req.user as DecodedUser;
    const {categoryName} = req.body

    const category = await prisma.category.findUnique({
        where:{
            name:categoryName
        }
    })

    if(category){
        handleError(res,`Category exists: ${categoryName}`, 400)
        return;
    }

    const newCategory = await prisma.category.create({
        data:{
            name:categoryName
        }
    })

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: `A category named ${categoryName}  created succesfully`,
    });
    return;
}