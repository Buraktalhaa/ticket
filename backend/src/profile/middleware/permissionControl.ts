import { NextFunction, Request, Response } from "express";
import prisma from "../../common/utils/prisma";
import { handleError } from "../../common/error-handling/handleError";


export async function permissionControl(req: Request, res: Response, next: NextFunction) {
    const decoded = req.user;
    const userId: string = decoded?.userId

    const userRole = await prisma.userRole.findUnique({
        where: {
            userId
        }, include: {
            role: {
                include: {
                    Permit: {
                        include: {
                            permission: true
                        }
                    }
                }
            }
        }
    })
    // endpoint path
    const url = req.path
    console.log("path url =>",url)

    try {
        const hasPermission = userRole?.role.Permit.some((element) => element.permission.url == url);

        if (hasPermission) {
            next()
            return
        }
        handleError(res, "Permission denied", 400)
        return;
    }
    catch(error){
        console.log("error")
        return
    }



}