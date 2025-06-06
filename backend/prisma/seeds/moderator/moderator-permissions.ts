import prisma from "../../../src/common/utils/prisma";

export const createModeratorPermissions = async () => {
  // Moderator Permissions
  const moderatorPermission1 = await prisma.permission.create({data: { url: '/create-category' }});

  const moderatorPermission2 = await prisma.permission.create({data: { url: '/delete-category' }});

  const moderatorPermission3 = await prisma.permission.create({data: { url: '/edit-category' }});

  const moderatorPermission4 = await prisma.permission.create({data: { url: '/update-status' }});

  const moderatorPermission5 = await prisma.permission.create({data: { url: '/moderator/status-panel' }});

  const moderatorPermission6 = await prisma.permission.create({data: { url: '/moderator/status-panel/update-status' }});

  return {
    moderatorPermission1,
    moderatorPermission2,
    moderatorPermission3,
    moderatorPermission4,
    moderatorPermission5,
    moderatorPermission6
  };
};
