import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCategories = async () => {
  const category1 = await prisma.category.create({ data: { name: 'flight' } });
  const category2 = await prisma.category.create({ data: { name: 'train' } });
  const category3 = await prisma.category.create({ data: { name: 'bus' } });
  const category4 = await prisma.category.create({ data: { name: 'hotel' } });
  const category5 = await prisma.category.create({ data: { name: 'movie' } });
  const category6 = await prisma.category.create({ data: { name: 'theater' } });
  const category7 = await prisma.category.create({ data: { name: 'concert' } });

  return {
    category1,
    category2,
    category3,
    category4,
    category5,
    category6,
    category7,
  };
};