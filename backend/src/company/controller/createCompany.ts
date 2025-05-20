import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto';
import { ResponseStatus } from '../../common/enums/status.enum';
import { Email } from '../../common/utils/email';
import { handleError } from '../../common/error-handling/handleError';
import { createToken } from '../../auth/utils/createToken';
import { RoleType } from '@prisma/client';

export async function createCompany(req: Request, res: Response) {
    const { name, phone, email } = req.body

    const company = await prisma.company.create({
        data: {
            name,
            phone,
            email
        }
    })

    const sellerEmail1 = email.replace('@', '.seller1@');
    const sellerEmail2 = email.replace('@', '.seller2@');

    const existingSeller1 = await prisma.auth.findUnique({
        where: {
            email: sellerEmail1
        }
    });

    if (existingSeller1) {
        handleError(res, 'Seller1 email already exists', 400);
        return
    }


    const existingSeller2 = await prisma.auth.findUnique({
        where: {
            email: sellerEmail2
        }
    });

    if (existingSeller2) {
        handleError(res, 'Seller2 email already exists', 400);
        return
    }


    const seller1_password_plain = randomUUID();
    const seller1_password = await bcrypt.hash(seller1_password_plain, 10);

    const seller2_password_plain = randomUUID();
    const seller2_password = await bcrypt.hash(seller2_password_plain, 10);

    const birthday = new Date().toISOString().split('T')[0]

    // Create auth for seller1
    const createAuthSeller1 = await prisma.auth.create({
        data: {
            email: sellerEmail1,
            password: seller1_password
        }
    })

    // Create user for seller1 
    const createSeller1 = await prisma.user.create({
        data: {
            firstName: `${name}1`,
            lastName: name,
            birthday,
            active: true,
            photoName: "",
            email: createAuthSeller1.email,
            companyId: company.id,
        }
    });


    // Create auth for seller2
    const createAuthSeller2 = await prisma.auth.create({
        data: {
            email: sellerEmail2,
            password: seller2_password
        }
    })

    // Create user for seller2
    const createSeller2 = await prisma.user.create({
        data: {
            firstName: `${name}2`,
            lastName: name,
            birthday,
            active: true,
            photoName: "",
            email: createAuthSeller2.email,
            companyId: company.id,
        }
    });

    const accessToken1 = createToken(createSeller1.id, sellerEmail1, 'seller', process.env.ACCESS_SECRET!, 10 * 60 * 24)
    const refreshToken1 = createToken(createSeller1.id, sellerEmail1, 'seller', process.env.REFRESH_SECRET!, 48 * 60 * 60)

    // Create Token1
    await prisma.token.create({
        data: {
            accessToken: accessToken1,
            refreshToken: refreshToken1,
            userId: createSeller1.id
        }
    })

    const accessToken2 = createToken(createSeller2.id, sellerEmail2, 'seller', process.env.ACCESS_SECRET!, 10 * 60 * 24)
    const refreshToken2 = createToken(createSeller2.id, sellerEmail2, 'seller', process.env.REFRESH_SECRET!, 48 * 60 * 60)

    // Create Token2
    await prisma.token.create({
        data: {
            accessToken: accessToken2,
            refreshToken: refreshToken2,
            userId: createSeller2.id
        }
    })

    //Create Role
    const sellerRole = await prisma.role.findUnique({
        where: {
            name: RoleType.seller
        }
    });

    if(!sellerRole){
        handleError(res, 'Seller role missing', 400);
        return
    }

    // Create userRole
    await prisma.userRole.create({
        data: {
            userId: createSeller1.id,
            roleId: sellerRole.id
        }
    })

    await prisma.userRole.create({
        data: {
            userId: createSeller2.id,
            roleId: sellerRole.id
        }
    })




    const sellersData = [
        { email: createAuthSeller1.email, password: seller1_password_plain },
        { email: createAuthSeller2.email, password: seller2_password_plain },
    ];

    const emailService = new Email({ email, firstName: name }, 'http://localhost:3000/company/create-company');
    await emailService.sendSellers(sellersData);



    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        message: "Company and sellers created successfully.",
        data: {
            company,
            sellers: [createSeller1, createSeller2]
        }
    });
    return
}