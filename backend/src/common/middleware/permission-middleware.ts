import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { handleError } from "../error-handling/handle-error";
import { DecodedUser } from "../types/request.type";

export async function permissionControl(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.user as DecodedUser;

    // endpoint path    
    const url = req.path


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

    if (!userRole || !userRole.role) {
        handleError(res, "Your role information could not be found. Please contact support.", 403);
        return
    }

    try {
        const hasPermission = userRole?.role.Permit.some((element) => element.permission.url === url);

        if (hasPermission) {
            next()
            return
        }

        if (!hasPermission) {
            handleError(res, "You do not have permission to access this resource. Please check your access rights.", 403);
            return
        }
    }
    catch (error) {
        handleError(res, "An unexpected error occurred while checking your access permissions.", 500);
        return
    }
}