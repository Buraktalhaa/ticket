import prisma from '../src/common/utils/prisma';


async function main() {
    const userRole = await prisma.role.create({
        data: {
            name: 'user'
        }
    });

    const adminRole = await prisma.role.create({
        data: {
            name: 'admin'
        }
    });

    const sellerRole = await prisma.role.create({
        data: {
            name: 'seller'
        }
    });


    const userPermission1 = await prisma.permission.create({
        data: {
            url: '/myProfile'
        }
    });

    const userPermission2 = await prisma.permission.create({
        data: {
            url: '/myProfile/update'
        }
    });

    await prisma.permit.create({
        data: {
            roleId: userRole.id,
            permissionId: userPermission1.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: adminRole.id,
            permissionId: userPermission2.id
        }
    })


    console.log('Seed işlemi tamamlandı.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


  // npx prisma db seed