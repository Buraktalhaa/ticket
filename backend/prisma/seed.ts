import { RoleType } from '@prisma/client';
import prisma from '../src/common/utils/prisma';
import bcrypt from 'bcryptjs'
import { createToken } from '../src/auth/utils/create-token';
import { generatePNR } from '../src/common/utils/generatePnr';

async function main() {

  // Default company
  const company = await prisma.company.create({
    data: {
      name: 'BTM',
      phone: '05071808810',
      email: 'btm@gmail.com'
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
      birthday: new Date('2001-02-21'),
      active: true,
      photoName: "",
      email,
      companyId: company.id
    }
  })

  const seller2 = await prisma.user.create({
    data: {
      firstName: "Burak",
      lastName: "Talha",
      birthday: new Date('2001-02-21'),
      active: true,
      photoName: "",
      email: email2,
      companyId: company.id
    }
  })

  const sellerAuth = await prisma.auth.create({
    data: {
      email: seller.email,
      password: hashedPassword
    }
  })

  const sellerAuth2 = await prisma.auth.create({
    data: {
      email: seller2.email,
      password: hashedPassword2
    }
  })

  const accessTokenSeller = createToken(seller.id, email, 'seller', process.env.ACCESS_SECRET!, 4800 * 60 * 24)
  const refreshTokenSeller = createToken(seller.id, email, 'seller', process.env.REFRESH_SECRET!, 4800 * 60 * 24)

  await prisma.token.create({
    data: {
      accessToken: accessTokenSeller,
      refreshToken: refreshTokenSeller,
      userId: seller.id
    }
  })

  const accessTokenSeller2 = createToken(seller2.id, email2, 'user', process.env.ACCESS_SECRET!, 4800 * 60 * 24)
  const refreshTokenSeller2 = createToken(seller2.id, email2, 'user', process.env.REFRESH_SECRET!, 48 * 60 * 60)

  await prisma.token.create({
    data: {
      accessToken: accessTokenSeller2,
      refreshToken: refreshTokenSeller2,
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
      birthday: new Date('2001-02-21'),
      active: true,
      photoName: "a",
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
      roleId: userRole.id
    }
  })

  await prisma.userRole.create({ // Sil TODO:
    data: {
      userId: admin.id,
      roleId: adminRole.id
    }
  })



  // User permissions
  const userPermission1 = await prisma.permission.create({
    data: {
      url: '/my-profile'
    }
  });

  const userPermission2 = await prisma.permission.create({
    data: {
      url: '/my-profile/edit'
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

  const userPermission8 = await prisma.permission.create({
    data: {
      url: '/get-cart'
    }
  });

  const userPermission9 = await prisma.permission.create({
    data: {
      url: '/add-to-cart'
    }
  });

  const userPermission10 = await prisma.permission.create({
    data: {
      url: '/update-cart'
    }
  });

  const userPermission11 = await prisma.permission.create({
    data: {
      url: '/delete-cart'
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
      url: '/seller/seller-tickets'
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
      url: '/admin/status-panel'
    }
  });

  const adminPermission6 = await prisma.permission.create({
    data: {
      url: '/admin/status-panel/update-status'
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

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission8.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission9.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission10.id
    }
  })

  await prisma.permit.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission11.id
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
    data: { name: 'flight' },
  });

  const category2 = await prisma.category.create({
    data: { name: 'train' },
  });

  const category3 = await prisma.category.create({
    data: { name: 'bus' },
  });

  const category4 = await prisma.category.create({
    data: { name: 'hotel' },
  });

  const category5 = await prisma.category.create({
    data: { name: 'movie' },
  });

  const category6 = await prisma.category.create({
    data: { name: 'theater' },
  });

  const category7 = await prisma.category.create({
    data: { name: 'concert' },
  });


  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  
await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category7.id,
    price: 100,
    pnr: generatePNR(),
    title: 'Rock Concert',
    description: 'An unforgettable night of powerful rock music and energetic performances.',
    city: 'Istanbul',
    location: 'Vodafone Park, Besiktas, Istanbul, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.1,
    companyId: company.id,
    dateTime: new Date(2025, 4, 28, 20, 30),
    stock: 1,
    sold: false,
    status: 'approve',
    images:['https://t3.ftcdn.net/jpg/00/88/02/10/360_F_88021032_dsYK2aloqCP1yMsmFlKyjr3L48DVxoxQ.jpg'],
    discount:10
  },
});

await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category7.id,
    price: 80,
    pnr: generatePNR(),
    title: 'Pop Music Show',
    description: 'Live pop music concert with dazzling lights and world-famous artists.',
    city: 'Izmir',
    location: 'Kültürpark Open Air Theater, Izmir, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.05,
    companyId: company.id,
    dateTime: new Date('2025-05-28T20:30:00Z'),
    stock: 2,
    sold: false,
    images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4'],
    status: 'approve',
    discount: 25
  },
});

// Theater Tickets
await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category6.id,
    price: 60,
    pnr: generatePNR(),
    title: 'Shakespeare Night',
    description: 'Classic Shakespearean drama brought to life with modern flair.',
    city: 'Ankara',
    location: 'State Theater, Tunali Hilmi Street, Ankara, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.08,
    companyId: company.id,
    dateTime: new Date(2025, 4, 28, 20, 30),
    stock: 1,
    sold: false,
    status: 'approve',
    images:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGzC-SoAzgImqKoesWZiZ8PnrHp6MtUyDkoA&s'],
    discount: 50
  },
});

await prisma.ticket.create({
  data: {
    userId: seller.id,
    categoryId: category6.id,
    price: 50,
    pnr: generatePNR(),
    title: 'Modern Comedy',
    description: 'A hilarious modern comedy play guaranteed to make you laugh out loud.',
    city: 'Istanbul',
    location: 'Kadikoy Public Theater, Istanbul, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.07,
    companyId: company.id,
    dateTime: new Date(2025, 4, 28, 20, 30),
    stock: 250,
    sold: false,
    images: ['https://images.cadenzabox.com/?url=https%3A%2F%2Fstorage.googleapis.com%2Fcadenzabox-prod-bucket%2Fmegatrax%2Fmx267%2F5fc69daaf62b9b00155c62bc_MX267.jpg&w=750'],
    status: 'approve',
    discount: 0
  },
});

// Festival Tickets
await prisma.ticket.create({
  data: {
    userId: seller2.id,
    categoryId: category5.id,
    price: 120,
    pnr: generatePNR(),
    title: 'The Two Towers Screening',
    description: 'A special outdoor screening of The Lord of the Rings: The Two Towers.',
    city: 'Antalya',
    location: 'Beachside Cinema Festival Area, Lara, Antalya, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.1,
    companyId: company.id,
    dateTime: new Date(2025, 4, 28, 20, 30),
    stock: 1000,
    sold: false,
    images: [
      'https://atthemovies.uk/cdn/shop/products/LORthetwotowers2002dsAdv27x40in150.jpg?v=1621381412&width=1400',
      'https://static.wikitide.net/1d6chanwiki/thumb/0/05/LotR.jpg/800px-LotR.jpg'
    ],
    status: 'approve',
    discount: 20
  },
});

await prisma.ticket.create({
  data: {
    userId: seller2.id,
    categoryId: category1.id,
    price: 95,
    pnr: generatePNR(),
    title: 'Flight to Mugla',
    description: 'Direct flight from Ankara to Mugla operated by Turkish Airlines.',
    city: 'Ankara',
    location: 'Esenboga Airport, Domestic Terminal, Ankara, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.09,
    companyId: company.id,
    dateTime: new Date(2025, 4, 28, 20, 30),
    stock: 700,
    sold: false,
    images: ['https://static1.eskypartners.com/travelguide/Fotolia_126229299_Subscription_Monthly_M.jpg'],
    status: 'approve',
    discount: 12
  },
});

await prisma.ticket.create({
  data: {
    userId: seller2.id,
    categoryId: category1.id,
    price: 95,
    pnr: generatePNR(),
    title: 'Flight to Ankara',
    description: 'Direct flight from Mugla to Ankara with excellent onboard service.',
    city: 'Mugla',
    location: 'Milas-Bodrum Airport, Mugla, Turkey',
    pointExpiresAt: expiresAt,
    pointRate: 0.09,
    companyId: company.id,
    dateTime: new Date(2025, 4, 28, 20, 30),
    stock: 700,
    sold: false,
    images: ['https://static1.eskypartners.com/travelguide/Fotolia_126229299_Subscription_Monthly_M.jpg'],
    status: 'approve',
    discount: 10
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