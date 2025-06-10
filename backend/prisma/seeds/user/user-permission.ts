import prisma from "../../../src/common/utils/prisma";

export const createUserPermissions = async () => {
  // User permissions
  const userPermission1 = await prisma.permission.create({ data: { url: '/my-profile' } });
  
  const userPermission2 = await prisma.permission.create({ data: { url: '/my-profile/edit' } });
  
  const userPermission3 = await prisma.permission.create({ data: { url: '/get-points' } });
  
  const userPermission4 = await prisma.permission.create({ data: { url: '/create-order' } });
  
  const userPermission5 = await prisma.permission.create({ data: { url: '/delete-order' } });
  
  const userPermission6 = await prisma.permission.create({ data: { url: '/get-orders' } });
  
  const userPermission7 = await prisma.permission.create({ data: { url: '/cancel-order' } });
  
  const userPermission8 = await prisma.permission.create({ data: { url: '/get-cart' } });
  
  const userPermission9 = await prisma.permission.create({ data: { url: '/add-to-cart' } });
  
  const userPermission10 = await prisma.permission.create({ data: { url: '/update-cart' } });
  
  const userPermission11 = await prisma.permission.create({ data: { url: '/delete-cart' } });
  
  const userPermission12 = await prisma.permission.create({ data: { url: '/add-favorite' } });
  
  const userPermission13 = await prisma.permission.create({ data: { url: '/get-favorites' } });
  
  const userPermission14 = await prisma.permission.create({ data: { url: '/delete-favorite' } });

  return {
    userPermission1,
    userPermission2,
    userPermission3,
    userPermission4,
    userPermission5,
    userPermission6,
    userPermission7,
    userPermission8,
    userPermission9,
    userPermission10,
    userPermission11,
    userPermission12,
    userPermission13,
    userPermission14
  };
};
