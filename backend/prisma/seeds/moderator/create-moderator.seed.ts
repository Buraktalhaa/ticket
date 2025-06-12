import prisma from "../../../src/common/utils/prisma";
import bcrypt from 'bcryptjs'
import { createToken } from "../../../src/auth/utils/create-token";
import { createModeratorPermissions } from "./moderator-permissions";
import { RoleType } from "@prisma/client";

export const moderatorSeed = async () => {
    const moderatorRole = await prisma.role.create({
        data: {
            name: RoleType.moderator
        }
    });

    const moderatorPermissions = await createModeratorPermissions()

    // Default Moderator
    const passwordModerator = 'm'
    const emailModerator = 'm'
    const hashedPasswordModerator = await bcrypt.hash(passwordModerator, 10);

    const moderator = await prisma.user.create({
        data: {
            firstName: "moderator",
            lastName: "moderator",
            birthday: new Date('2001-02-21'),
            active: true,
            email: emailModerator
        }
    })

    // default moderator
    await prisma.auth.create({
        data: {
            email: moderator.email,
            password: hashedPasswordModerator
        }
    })

    const accessTokenModerator = createToken(moderator.id, emailModerator, 'moderator', process.env.ACCESS_SECRET!, 10 * 60 * 24)
    const refreshTokenModerator = createToken(moderator.id, emailModerator, 'moderator', process.env.REFRESH_SECRET!, 48 * 60 * 60)

    await prisma.token.create({
        data: {
            accessToken: accessTokenModerator,
            refreshToken: refreshTokenModerator,
            userId: moderator.id
        }
    })


    await prisma.userRole.create({
        data: {
            userId: moderator.id,
            roleId: moderatorRole.id
        }
    })

    // Moderator
    await prisma.permit.create({
        data: {
            roleId: moderatorRole.id,
            permissionId: moderatorPermissions.moderatorPermission1.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: moderatorRole.id,
            permissionId: moderatorPermissions.moderatorPermission2.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: moderatorRole.id,
            permissionId: moderatorPermissions.moderatorPermission3.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: moderatorRole.id,
            permissionId: moderatorPermissions.moderatorPermission4.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: moderatorRole.id,
            permissionId: moderatorPermissions.moderatorPermission5.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: moderatorRole.id,
            permissionId: moderatorPermissions.moderatorPermission6.id
        }
    })
}