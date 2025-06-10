import prisma from "../../../src/common/utils/prisma"

export const createCompany = async () => {

    const companyBtm = await prisma.company.create({
        data: {
            name: 'BTM',
            phone: '123456',
            email: 'btm@gmail.com'
        }
    })

    return {
        companyBtm
    }
}