import prisma from '../src/common/utils/prisma';
import { adminSeed } from './seeds/admin/create-admin.seed';
import { moderatorSeed } from './seeds/moderator/create-moderator.seed';
import { sellerSeed } from './seeds/seller/create-seller.seed';
import { userSeed } from './seeds/user/create-user.seed';

async function main() {
  console.log('Seeding started...');
  await sellerSeed()
  await userSeed()
  await moderatorSeed()
  await adminSeed()
  console.log('Seed finished.');
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