import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: node scripts/promote-admin.js <user-email>');
    console.log('\nListing current users in database:');
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    console.table(users);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ User with email "${email}" not found.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log(`✅ User ${updated.name} (${updated.email}) is now an ADMIN!`);
}

main()
  .catch((e) => {
    console.error('Error promoting user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
