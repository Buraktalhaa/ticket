import { createToken } from "../../../src/auth/utils/create-token";
import prisma from "../../../src/common/utils/prisma";
import bcrypt from 'bcryptjs'
import { generatePNR } from "../../../src/common/utils/generatePnr";
import { createCategories } from "../common/create-categories";
import { createRoles } from "../common/create-role";
import { createCompany } from "./create-company.seed";
import { createSellerPermissions } from "./seller-permissions";

export const sellerSeed = async () => {

    // Company
    const company = await createCompany()
    // SellerRole
    const sellerRole = await createRoles()
    // Seller permissions
    const sellerPermissions = await createSellerPermissions()


    // Default seller
    const sellerEmail1 = 'b'
    const sellerPassword1 = 'b'
    const hashedPassword = await bcrypt.hash(sellerPassword1, 10);

    // Create seller for BTM company
    const seller1 = await prisma.user.create({
        data: {
            firstName: "Burak",
            lastName: "Talha",
            birthday: new Date('2001-02-21'),
            active: true,
            photoName: "",
            email: sellerEmail1,
            companyId: company.companyBtm.id
        }
    })

    await prisma.auth.create({
        data: {
            email: seller1.email,
            password: hashedPassword
        }
    })

    const accessTokenSeller = createToken(seller1.id, sellerEmail1, 'seller', process.env.ACCESS_SECRET!, 4800 * 60 * 24)
    const refreshTokenSeller = createToken(seller1.id, sellerEmail1, 'seller', process.env.REFRESH_SECRET!, 4800 * 60 * 24)

    await prisma.token.create({
        data: {
            accessToken: accessTokenSeller,
            refreshToken: refreshTokenSeller,
            userId: seller1.id
        }
    })

    await prisma.userRole.create({
        data: {
            userId: seller1.id,
            roleId: sellerRole.sellerRole.id
        }
    })


    const email2 = 'c'
    const sellerPassword2 = 'c'
    const hashedPassword2 = await bcrypt.hash(sellerPassword2, 10);

    const seller2 = await prisma.user.create({
        data: {
            firstName: "Burak",
            lastName: "Talha",
            birthday: new Date('2001-02-21'),
            active: true,
            photoName: "",
            email: email2,
            companyId: company.companyBtm.id
        }
    })

    await prisma.auth.create({
        data: {
            email: seller2.email,
            password: hashedPassword2
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

    await prisma.userRole.create({
        data: {
            userId: seller2.id,
            roleId: sellerRole.sellerRole.id  
        }
    })

    // Seller
    await prisma.permit.create({
        data: {
            roleId: sellerRole.sellerRole.id,
            permissionId: sellerPermissions.sellerPermission1.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: sellerRole.sellerRole.id,
            permissionId: sellerPermissions.sellerPermission2.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: sellerRole.sellerRole.id,
            permissionId: sellerPermissions.sellerPermission3.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: sellerRole.sellerRole.id,
            permissionId: sellerPermissions.sellerPermission4.id
        }
    })

    await prisma.permit.create({
        data: {
            roleId: sellerRole.sellerRole.id,
            permissionId: sellerPermissions.sellerPermission5.id
        }
    })

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const categories = await createCategories();

    await prisma.ticket.create({
        data: {
            userId: seller1.id,
            categoryId: categories.category7.id,
            price: 100,
            pnr: generatePNR(),
            title: 'Rock Concert',
            description: 'An unforgettable night of powerful rock music and energetic performances.',
            city: 'Istanbul',
            location: 'Vodafone Park, Besiktas, Istanbul, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.1,
            companyId: company.companyBtm.id,
            dateTime: new Date(2025, 4, 28, 20, 30),
            stock: 1,
            sold: false,
            status: 'approve',
            images: ['https://t3.ftcdn.net/jpg/00/88/02/10/360_F_88021032_dsYK2aloqCP1yMsmFlKyjr3L48DVxoxQ.jpg'],
            discount: 10
        },
    });

    await prisma.ticket.create({
        data: {
            userId: seller1.id,
            categoryId: categories.category7.id,
            price: 80,
            pnr: generatePNR(),
            title: 'Pop Music Show',
            description: 'Live pop music concert with dazzling lights and world-famous artists.',
            city: 'Izmir',
            location: 'Kültürpark Open Air Theater, Izmir, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.05,
            companyId: company.companyBtm.id,
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
            userId: seller1.id,
            categoryId: categories.category6.id,
            price: 60,
            pnr: generatePNR(),
            title: 'Shakespeare Night',
            description: 'Classic Shakespearean drama brought to life with modern flair.',
            city: 'Ankara',
            location: 'State Theater, Tunali Hilmi Street, Ankara, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.08,
            companyId: company.companyBtm.id,
            dateTime: new Date(2025, 4, 28, 20, 30),
            stock: 1,
            sold: false,
            status: 'approve',
            images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGzC-SoAzgImqKoesWZiZ8PnrHp6MtUyDkoA&s'],
            discount: 50
        },
    });

    await prisma.ticket.create({
        data: {
            userId: seller1.id,
            categoryId: categories.category6.id,
            price: 50,
            pnr: generatePNR(),
            title: 'Modern Comedy',
            description: 'A hilarious modern comedy play guaranteed to make you laugh out loud.',
            city: 'Istanbul',
            location: 'Kadikoy Public Theater, Istanbul, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.07,
            companyId: company.companyBtm.id,
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
            categoryId: categories.category5.id,
            price: 120,
            pnr: generatePNR(),
            title: 'The Two Towers Screening',
            description: 'A special outdoor screening of The Lord of the Rings: The Two Towers.',
            city: 'Antalya',
            location: 'Beachside Cinema Festival Area, Lara, Antalya, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.1,
            companyId: company.companyBtm.id,
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
            categoryId: categories.category1.id,
            price: 95,
            pnr: generatePNR(),
            title: 'Flight to Mugla',
            description: 'Direct flight from Ankara to Mugla operated by Turkish Airlines.',
            city: 'Ankara',
            location: 'Esenboga Airport, Domestic Terminal, Ankara, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.09,
            companyId: company.companyBtm.id,
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
            categoryId: categories.category1.id,
            price: 95,
            pnr: generatePNR(),
            title: 'Flight to Ankara',
            description: 'Direct flight from Mugla to Ankara with excellent onboard service.',
            city: 'Mugla',
            location: 'Milas-Bodrum Airport, Mugla, Turkey',
            pointExpiresAt: expiresAt,
            pointRate: 0.09,
            companyId: company.companyBtm.id,
            dateTime: new Date(2025, 4, 28, 20, 30),
            stock: 700,
            sold: false,
            images: ['https://static1.eskypartners.com/travelguide/Fotolia_126229299_Subscription_Monthly_M.jpg'],
            status: 'approve',
            discount: 10
        },
    });
}

sellerSeed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });