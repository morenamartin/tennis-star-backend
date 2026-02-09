import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedCategories } from './category.seed';
import { seedProducts } from './products.seed';
import { seedClients } from './clients.seed';
import { seedSales } from './sales.seed';
import { seedBrands } from './brand.seed';

const prisma = new PrismaClient({
  log: ['info'],
});


async function main() {
  console.log('Starting seed...');

  await seedBrands(prisma);
  console.log('Brands seeded ✓');

  await seedCategories(prisma);
  console.log('Categories seeded ✓');

  await seedProducts(prisma);
  console.log('Products seeded ✓');

  await seedClients(prisma);
  console.log('Clients seeded ✓');

  await seedSales(prisma);
  console.log('Sales seeded ✓');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
