import prisma from "../../../src/common/utils/prisma";

export const createSellerPermissions = async () => {
    // Seller Permission 
    const sellerPermission1 = await prisma.permission.create({ data: { url: '/create-ticket' } });

    const sellerPermission2 = await prisma.permission.create({ data: { url: '/delete-ticket' } });

    const sellerPermission3 = await prisma.permission.create({ data: { url: '/edit-ticket' } });

    const sellerPermission4 = await prisma.permission.create({ data: { url: '/is-seller' } });

    const sellerPermission5 = await prisma.permission.create({ data: { url: '/seller/seller-tickets' } });

    return {
        sellerPermission1,
        sellerPermission2,
        sellerPermission3,
        sellerPermission4,
        sellerPermission5
    }
}