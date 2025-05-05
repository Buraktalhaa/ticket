import { RoleType } from '@prisma/client';
import prisma from '../src/common/utils/prisma';
import bcrypt from 'bcrypt'
import { createToken } from '../src/auth/utils/createToken';


async function main() {

  // Default company
  const company = await prisma.company.create({
    data:{
      name:'BTM',
      phone:'05071808810',
      email:'btm@gmail.com'
    }
  })

  // Default seller
  const password = '1234'
  const email = 'btmseller@gmail.com'
  const hashedPassword = await bcrypt.hash(password, 10);

  const authSeller = await prisma.auth.create({
    data: {
      email,
      password: hashedPassword
    }
  })

  // Create seller for BTM company
  const seller = await prisma.user.create({
    data: {
      firstName: "Burak",
      lastName: "Talha",
      birthday: "21.02.2001",
      active: true,
      photoName: "",
      email: authSeller.email,
      companyId:company.id
    }
  })

  const accessTokenSeller = createToken(seller.id, email, process.env.ACCESS_SECRET!, 10 * 60 * 24)
  const refreshTokenSeller = createToken(seller.id, email, process.env.REFRESH_SECRET!, 48 * 60 * 60)

  await prisma.token.create({
    data: {
      accessToken:accessTokenSeller,
      refreshToken:refreshTokenSeller,
      userId: seller.id
    }
  })


  // Default admin
  const passwordAdmin = '1234'
  const emailAdmin = 'admin@gmail.com'
  const hashedPasswordAdmin = await bcrypt.hash(passwordAdmin, 10);

  const authAdmin = await prisma.auth.create({
    data: {
      email:emailAdmin,
      password: hashedPasswordAdmin
    }
  })

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "admin",
      birthday: "21.02.2001",
      active: true,
      photoName: "a",
      email: authAdmin.email
    }
  })

  const accessTokenAdmin = createToken(admin.id, emailAdmin, process.env.ACCESS_SECRET!, 10 * 60 * 24)
  const refreshTokenAdmin = createToken(admin.id, emailAdmin, process.env.REFRESH_SECRET!, 48 * 60 * 60)

  await prisma.token.create({
    data: {
      accessToken:accessTokenAdmin,
      refreshToken:refreshTokenAdmin,
      userId: admin.id
    }
  })


  // Roles
  const userRole = await prisma.role.create({
    data: {
      name: RoleType.user
    }
  });

  const sellerRole = await prisma.role.create({
    data: {
      name: RoleType.seller
    }
  });

  const adminRole = await prisma.role.create({
    data: {
      name: RoleType.admin
    }
  });


  // Default
  await prisma.userRole.create({ //Sil TODO:
    data: {
      userId: seller.id,
      roleId: sellerRole.id
    }
  })

  await prisma.userRole.create({ // Sil TODO:
    data:{
      userId: admin.id,
      roleId: adminRole.id
    }
  })











  // User permissions
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

  const userPermission3 = await prisma.permission.create({
    data: {
      url: '/get-points'
    }
  });

  const userPermission4 = await prisma.permission.create({
    data: {
      url: '/create-order'
    }
  });

  const userPermission5 = await prisma.permission.create({
    data: {
      url: '/delete-order'
    }
  });

  const userPermission6 = await prisma.permission.create({
    data: {
      url: '/get-orders'
    }
  });





  


  // Seller Permission 
  const sellerPermission1 = await prisma.permission.create({
    data: {
      url: '/create-ticket'
    }
  });

  const sellerPermission2 = await prisma.permission.create({
    data: {
      url: '/delete-ticket'
    }
  });


  const sellerPermission3 = await prisma.permission.create({
    data: {
      url: '/edit-ticket'
    }
  });


  // Admin Permission 

  const adminPermission1 = await prisma.permission.create({
    data: {
      url: '/create-category'
    }
  });

  const adminPermission2 = await prisma.permission.create({
    data: {
      url: '/delete-category'
    }
  });

  const adminPermission3 = await prisma.permission.create({
    data: {
      url: '/edit-category'
    }
  });

  const adminPermission4 = await prisma.permission.create({
    data: {
      url: '/update-status'
    }
  });


  // User
  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission1.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission2.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission3.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission4.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission5.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission6.id
    }
  })





  // Seller
  await prisma.permit.create({
    data: {
      roleId: sellerRole.id,
      permissionId: sellerPermission1.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: sellerRole.id,
      permissionId: sellerPermission2.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: sellerRole.id,
      permissionId: sellerPermission3.id
    }
  })  


  // Admin
  await prisma.permit.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission1.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission2.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission3.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission4.id
    }
  })





  // Category
  const category1 = await prisma.category.create({
    data: {
      name: 'Concert',
    },
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Ticket
  const ticket = await prisma.ticket.create({
    data: {
      userId: seller.id,
      categoryId: category1.id,
      price: 100,
      description: 'Seed created this ticket',
      hour:10,  
      pointExpiresAt:expiresAt,
      pointRate:0.1, 
      companyId:company.id,
      day: new Date('2025-05-10'),       
      stock: 10,
      sold: false,
      images: [],
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


//   npx prisma db seed