import { Request, Response } from 'express';
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { ResponseStatus } from '../../common/enums/status.enum';
import { Email } from '../../common/utils/email';
import { handleError } from '../../common/error-handling/handle-error';
import { createToken } from '../../auth/utils/create-token';
import { RoleType } from '@prisma/client';

export async function createCompany(req: Request, res: Response) {
    const { name, phone, email } = req.body;

    if (!name || !email || !phone) {
        handleError(res, 'Name, email and phone are required', 400);
        return
    }

    try {
        const [userPart, domainPart] = email.split('@');
        const sellerEmail1 = `${userPart}.seller1@${domainPart}`;
        const sellerEmail2 = `${userPart}.seller2@${domainPart}`;

        const [existingSeller1, existingSeller2] = await Promise.all([
            prisma.auth.findUnique({ where: { email: sellerEmail1 } }),
            prisma.auth.findUnique({ where: { email: sellerEmail2 } }),
        ]);

        if (existingSeller1 || existingSeller2) {
            handleError(res, 'Seller email already exists', 400);
            return
        }

        const [plainPass1, plainPass2] = [randomUUID(), randomUUID()];
        const [hashedPass1, hashedPass2] = await Promise.all([
            bcrypt.hash(plainPass1, 10),
            bcrypt.hash(plainPass2, 10),
        ]);

        const birthday = new Date().toISOString().split('T')[0];

        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: { name, phone, email }
            });

            const sellerRole = await tx.role.findUnique({
                where: { name: RoleType.seller }
            });

            if (!sellerRole) throw new Error('Seller role missing');

            const auth1 = await tx.auth.create({
                data: { email: sellerEmail1, password: hashedPass1 }
            });

            const seller1 = await tx.user.create({
                data: {
                    firstName: `${name}1`,
                    lastName: name,
                    birthday,
                    active: true,
                    photoName: '',
                    email: auth1.email,
                    companyId: company.id
                }
            });

            const auth2 = await tx.auth.create({
                data: { email: sellerEmail2, password: hashedPass2 }
            });

            const seller2 = await tx.user.create({
                data: {
                    firstName: `${name}2`,
                    lastName: name,
                    birthday,
                    active: true,
                    photoName: '',
                    email: auth2.email,
                    companyId: company.id
                }
            });

            const [accessToken1, refreshToken1] = [
                createToken(seller1.id, sellerEmail1, 'seller', process.env.ACCESS_SECRET!, 10 * 60 * 24),
                createToken(seller1.id, sellerEmail1, 'seller', process.env.REFRESH_SECRET!, 48 * 60 * 60)
            ];

            const [accessToken2, refreshToken2] = [
                createToken(seller2.id, sellerEmail2, 'seller', process.env.ACCESS_SECRET!, 10 * 60 * 24),
                createToken(seller2.id, sellerEmail2, 'seller', process.env.REFRESH_SECRET!, 48 * 60 * 60)
            ];

            await Promise.all([
                tx.token.create({ data: { accessToken: accessToken1, refreshToken: refreshToken1, userId: seller1.id } }),
                tx.token.create({ data: { accessToken: accessToken2, refreshToken: refreshToken2, userId: seller2.id } }),
                tx.userRole.create({ data: { userId: seller1.id, roleId: sellerRole.id } }),
                tx.userRole.create({ data: { userId: seller2.id, roleId: sellerRole.id } })
            ]);

            return {
                company,
                sellers: [seller1, seller2],
                emails: [auth1.email, auth2.email]
            };
        });

        const sellersData = [
            { email: result.emails[0], password: plainPass1 },
            { email: result.emails[1], password: plainPass2 }
        ];

        const emailService = new Email({ email, firstName: name }, `${process.env.BASE_URL}/company/create-company`);
        await emailService.sendSellers(sellersData);

        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: "Company and sellers created successfully.",
            data: {
                company: result.company,
                sellers: result.sellers
            }
        });
        return

    } catch (err: unknown) {
        if (err instanceof Error) {
            handleError(res, err.message || 'Internal server error', 500);
            return
        } else {
            handleError(res, 'Internal server error', 500);
            return
        }
    }
}