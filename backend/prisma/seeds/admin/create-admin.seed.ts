import prisma from "../../../src/common/utils/prisma";
import bcrypt from 'bcryptjs'
import { createToken } from "../../../src/auth/utils/create-token";
import { RoleType } from "@prisma/client";

export const adminSeed = async () => {
    // admin
    const adminRole = await prisma.role.create({
        data: {
            name: RoleType.admin
        }
    });

    // const adminPermissions = await createAdminPermissions()

    // Default Admin
    const passwordAdmin = 'admin@btm.com'
    const emailAdmin = 'Admin123!'
    const hashedPasswordAdmin = await bcrypt.hash(passwordAdmin, 10);

    const admin = await prisma.user.create({
        data: {
            firstName: "Admin",
            lastName: "Admin",
            birthday: new Date('2001-02-21'),
            active: true,
            email: emailAdmin
        }
    })

    const authAdmin = await prisma.auth.create({
        data: {
            email: admin.email,
            password: hashedPasswordAdmin
        }
    })

    const accessTokenAdmin = createToken(admin.id, emailAdmin, 'admin', process.env.ACCESS_SECRET!, 10 * 60 * 24)
    const refreshTokenAdmin = createToken(admin.id, emailAdmin, 'admin', process.env.REFRESH_SECRET!, 48 * 60 * 60)

    await prisma.token.create({
        data: {
            accessToken: accessTokenAdmin,
            refreshToken: refreshTokenAdmin,
            userId: admin.id
        }
    })

    await prisma.userRole.create({
        data: {
            userId: admin.id,
            roleId: adminRole.id
        }
    })
}