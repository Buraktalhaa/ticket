import { RoleType } from '@prisma/client';
import prisma from '../src/common/utils/prisma';
import bcrypt from 'bcryptjs'
import { createToken } from '../src/auth/utils/createToken';
import { generatePNR } from '../src/common/utils/generatePnr';


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
  const password = 'b'
  const email = 'b'
  const email2 = 'c'
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPassword2 = await bcrypt.hash('c', 10);

    // Create seller for BTM company
    const seller = await prisma.user.create({
      data: {
        firstName: "Burak",
        lastName: "Talha",
        birthday: "21.02.2001",
        active: true,
        photoName: "",
        email,
        companyId:company.id
      }
    })

    const seller2 = await prisma.user.create({
      data: {
        firstName: "Burak",
        lastName: "Talha",
        birthday: "21.02.2001",
        active: true,
        photoName: "",
        email:email2,
        companyId:company.id
      }
    })

  const sellerAuth = await prisma.auth.create({
    data: {
      email:seller.email,
      password: hashedPassword
    }
  })

  const sellerAuth2 = await prisma.auth.create({
    data: {
      email:seller2.email,
      password: hashedPassword2
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
  
  const accessTokenSeller2 = createToken(seller2.id, email, process.env.ACCESS_SECRET!, 10 * 60 * 24)
  const refreshTokenSeller2 = createToken(seller2.id, email, process.env.REFRESH_SECRET!, 48 * 60 * 60)

  await prisma.token.create({
    data: {
      accessToken:accessTokenSeller2,
      refreshToken:refreshTokenSeller2,
      userId: seller2.id
    }
  })


  // Default admin
  const passwordAdmin = 'admin'
  const emailAdmin = 'admin'
  const hashedPasswordAdmin = await bcrypt.hash(passwordAdmin, 10);

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "admin",
      birthday: "21.02.2001",
      active: true,
      photoName: "a",
      email:emailAdmin
    }
  })

  const authAdmin = await prisma.auth.create({
    data: {
      email:admin.email,
      password: hashedPasswordAdmin
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

  await prisma.userRole.create({
    data: {
      userId: seller2.id,
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

  const userPermission7 = await prisma.permission.create({
    data: {
      url: '/cancel-order'
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

  const sellerPermission4 = await prisma.permission.create({
    data: {
      url: '/is-seller'
    }
  });

  const sellerPermission5 = await prisma.permission.create({
    data: {
      url: '/seller/sellerTickets'
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
  const adminPermission5 = await prisma.permission.create({
    data: {
      url: '/admin/statusPanel'
    }
  });

  const adminPermission6 = await prisma.permission.create({
    data: {
      url: '/admin/statusPanel/update-status'
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

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission7.id
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

  await prisma.permit.create({
    data: {
      roleId: sellerRole.id,
      permissionId: sellerPermission4.id
    }
  })  

  await prisma.permit.create({
    data: {
      roleId: sellerRole.id,
      permissionId: sellerPermission5.id
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

  await prisma.permit.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission5.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission6.id
    }
  })



// Category
const category1 = await prisma.category.create({
  data: { name: 'Concert' },
});

const category2 = await prisma.category.create({
  data: { name: 'Theater' },
});

const category3 = await prisma.category.create({
  data: { name: 'Festival' },
});

const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7);

// Concert Tickets
await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category1.id,
    price: 100,
    pnr: generatePNR(),
    description: 'Rock concert in the city',
    hour: 20,
    pointExpiresAt: expiresAt,
    pointRate: 0.1,
    companyId: company.id,
    day: new Date('2025-06-01'),
    stock: 500,
    sold: false,
    images: [],
    status:'approve'
  },
});

await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category1.id,
    price: 80,
    pnr: generatePNR(),
    description: 'Pop music live show',
    hour: 19,
    pointExpiresAt: expiresAt,
    pointRate: 0.05,
    companyId: company.id,
    day: new Date('2025-06-03'),
    stock: 300,
    sold: false,
    images: [],
    status:'approve'

  },
});

// Theater Tickets
await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category2.id,
    price: 60,
    pnr: generatePNR(),
    description: 'Shakespeare play night',
    hour: 18,
    pointExpiresAt: expiresAt,
    pointRate: 0.08,
    companyId: company.id,
    day: new Date('2025-06-05'),
    stock: 200,
    sold: false,
    images: [],
    status:'approve'
  },
});

await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category2.id,
    price: 50,
    pnr: generatePNR(),
    description: 'Modern comedy theater',
    hour: 21,
    pointExpiresAt: expiresAt,
    pointRate: 0.07,
    companyId: company.id,
    day: new Date('2025-06-07'),
    stock: 250,
    sold: false,
    images: [],
    status:'approve'
  },
});

// Festival Tickets
await prisma.ticket.create({
  data: {
    userId: seller2.id,
    categoryId: category3.id,
    price: 120,
    pnr: generatePNR(),
    description: 'Summer music festival',
    hour: 15,
    pointExpiresAt: expiresAt,
    pointRate: 0.1,
    companyId: company.id,
    day: new Date('2025-06-10'),
    stock: 1000,
    sold: false,
    images: [],
    status:'approve'
  },
});

await prisma.ticket.create({
  data: {
    userId: seller2.id,
    categoryId: category3.id,
    price: 95,
    pnr: generatePNR(),
    description: 'Food and culture festival',
    hour: 13,
    pointExpiresAt: expiresAt,
    pointRate: 0.09,
    companyId: company.id,
    day: new Date('2025-06-12'),
    stock: 700,
    sold: false,
    images: [],
    status:'approve'
  },
});

await prisma.ticket.create({
  data: {
    userId: seller2.id,
    categoryId: category3.id,
    price: 95,
    pnr: generatePNR(),
    description: 'It is for testing',
    hour: 13,
    pointExpiresAt: expiresAt,
    pointRate: 0.09,
    companyId: company.id,
    day: new Date('2025-06-12'),
    stock: 700,
    sold: false,
    images: [],
  },
});






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