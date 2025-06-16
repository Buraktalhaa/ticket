import prisma from "../../../src/common/utils/prisma";

export const createAdminPermissions = async () => {
    // same with user
    const adminPermission1 = await prisma.permission.create({ data: { url: '/my-profile' } });
  
    const adminPermission2 = await prisma.permission.create({ data: { url: '/my-profile/edit' } });
    
    const adminPermission3 = await prisma.permission.create({ data: { url: '/get-points' } });
    
    const adminPermission4 = await prisma.permission.create({ data: { url: '/create-order' } });
    
    const adminPermission5 = await prisma.permission.create({ data: { url: '/delete-order' } });
    
    const adminPermission6 = await prisma.permission.create({ data: { url: '/get-orders' } });
    
    const adminPermission7 = await prisma.permission.create({ data: { url: '/cancel-order' } });
    
    const adminPermission8 = await prisma.permission.create({ data: { url: '/get-cart' } });
    
    const adminPermission9 = await prisma.permission.create({ data: { url: '/add-to-cart' } });
    
    const adminPermission10 = await prisma.permission.create({ data: { url: '/update-cart' } });
    
    const adminPermission11 = await prisma.permission.create({ data: { url: '/delete-cart' } });
    
    const adminPermission12 = await prisma.permission.create({ data: { url: '/add-favorite' } });
    
    const adminPermission13 = await prisma.permission.create({ data: { url: '/get-favorites' } });
    
    const adminPermission14 = await prisma.permission.create({ data: { url: '/delete-favorite' } });

    //same with seller
    const adminPermission15 = await prisma.permission.create({ data: { url: '/create-ticket' } });

    const adminPermission16 = await prisma.permission.create({ data: { url: '/delete-ticket' } });

    const adminPermission17 = await prisma.permission.create({ data: { url: '/edit-ticket' } });

    const adminPermission18 = await prisma.permission.create({ data: { url: '/is-seller' } });

    const adminPermission19 = await prisma.permission.create({ data: { url: '/tickets' } });

    // same with moderator
    const adminPermission20 = await prisma.permission.create({data: { url: '/create-category' }});

    const adminPermission21 = await prisma.permission.create({data: { url: '/delete-category' }});
  
    const adminPermission22 = await prisma.permission.create({data: { url: '/edit-category' }});
  
    const adminPermission23 = await prisma.permission.create({data: { url: '/update-status' }});
  
    const adminPermission24 = await prisma.permission.create({data: { url: '/status-panel' }});
  
    const adminPermission25 = await prisma.permission.create({data: { url: '/status-panel/update-status' }});
    return {
        adminPermission1,
        adminPermission2,
        adminPermission3,
        adminPermission4,
        adminPermission5,
        adminPermission6,
        adminPermission7,
        adminPermission8,
        adminPermission9,
        adminPermission10,
        adminPermission11,
        adminPermission12,
        adminPermission13,
        adminPermission14,
        adminPermission15,
        adminPermission16,
        adminPermission17,
        adminPermission18,
        adminPermission19,
        adminPermission20,
        adminPermission21,
        adminPermission22,
        adminPermission23,
        adminPermission24,
        adminPermission25,
    };
};