import { RoleType } from "@prisma/client";
import { createToken } from "../../../src/auth/utils/create-token";
import prisma from "../../../src/common/utils/prisma";
import bcrypt from 'bcryptjs'
import { createUserPermissions } from "./user-permission";

export const userSeed = async () => {
  // user
  const userRole = await prisma.role.create({
    data: {
      name: RoleType.user
    }
  });

  const userEmail1 = 'user@btm.com'
  const userPassword1 = 'User123!'

  const userPermissions = await createUserPermissions()

  const hashedPassword = await bcrypt.hash(userPassword1, 10);

  const user1 = await prisma.user.create({
    data: {
      firstName: "User",
      lastName: "User",
      birthday: new Date('2000-01-01'),
      active: true,
      email: userEmail1,
    }
  })

  await prisma.auth.create({
    data: {
      email: user1.email,
      password: hashedPassword
    }
  })

  const accessTokenSeller = createToken(user1.id, userEmail1, 'seller', process.env.ACCESS_SECRET!, 4800 * 60 * 24)
  const refreshTokenSeller = createToken(user1.id, userEmail1, 'seller', process.env.REFRESH_SECRET!, 4800 * 60 * 24)

  await prisma.token.create({
    data: {
      accessToken: accessTokenSeller,
      refreshToken: refreshTokenSeller,
      userId: user1.id
    }
  })

  await prisma.userRole.create({
    data: {
      userId: user1.id,
      roleId: userRole.id
    }
  })

  // User
  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission1.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission2.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission3.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission4.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission5.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission6.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission7.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission8.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission9.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission10.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission11.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission12.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission13.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermissions.userPermission14.id
    }
  })
}