// Seeds the database with the products and vendors already used on the frontend.
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PRODUCTS } from '../lib/products.js';
import { VENDORS } from '../lib/vendors.js';

const prisma = new PrismaClient();

function toKobo(priceField) {
  const value = typeof priceField === 'object' ? priceField.en : priceField;
  if (!value || typeof value !== 'string') return 0;
  const digits = value.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) * 100 : 0;
}

async function main() {
  console.log('Seeding vendors...');
  for (const v of VENDORS) {
    await prisma.vendor.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        name: v.name,
        location: v.location,
        specialty: v.specialty.en,
        verified: v.verified,
      },
    });
  }

  console.log('Seeding products...');
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name.en,
        nameYo: p.name.yo,
        tag: p.tag.en,
        weave: p.weave,
        priceKobo: toKobo(p.price),
        image: p.image || null,
      },
    });
  }

  console.log('Creating a default admin account (change this password immediately)...');
  const adminPassword = await bcrypt.hash('changeme123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@asookeluxe.com' },
    update: {},
    create: {
      name: 'AsoOkeLuxe Admin',
      email: 'admin@asookeluxe.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seed complete. Admin login: admin@asookeluxe.com / changeme123 (change this immediately)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
