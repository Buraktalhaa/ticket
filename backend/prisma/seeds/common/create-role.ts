import prisma from "../../../src/common/utils/prisma";
import { RoleType } from "@prisma/client";

export const createRoles = async () => {
    // user
    const userRole = await prisma.role.create({
        data: {
            name: RoleType.user
        }
    });

    // seller
    const sellerRole = await prisma.role.create({
        data: {
            name: RoleType.seller
        }
    });

    // moderator
    const moderatorRole = await prisma.role.create({
        data: {
            name: RoleType.moderator
        }
    });

    // admin
    const adminRole = await prisma.role.create({
        data: {
            name: RoleType.admin
        }
    });

    return {
        userRole,
        sellerRole,
        moderatorRole,
        adminRole
    }
}