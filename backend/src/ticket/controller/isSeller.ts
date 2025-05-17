import { Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { ResponseStatus } from "../../common/enums/status.enum";
import { DecodedUser } from "../../common/type/request.type";

export async function isSeller(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;

    const userRole = await prisma.userRole.findUnique({
        where:{
            userId
        },
        select:{
            role:true
        }
    })

    if(!userRole){
        return
    }

    console.log(userRole.role.name);
    

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        data: userRole.role.name
    });
    return;
}
