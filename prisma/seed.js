import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesToSeed = [
  { name: 'Food', icon: 'Utensils', color: '#EF4444' },          // Red
  { name: 'Travel', icon: 'Car', color: '#3B82F6' },            // Blue
  { name: 'Shopping', icon: 'ShoppingBag', color: '#10B981' },    // Emerald
  { name: 'Entertainment', icon: 'Film', color: '#F59E0B' },     // Amber
  { name: 'Bills', icon: 'Receipt', color: '#8B5CF6' },          // Purple
  { name: 'Medical', icon: 'Activity', color: '#EC4899' },       // Pink
  { name: 'Education', icon: 'GraduationCap', color: '#06B6D4' },// Cyan
  { name: 'Others', icon: 'Layers', color: '#6B7280' }           // Gray
];

async function main() {
  console.log('🌱 Checking category seeds...');
  for (const cat of categoriesToSeed) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        icon: cat.icon,
        color: cat.color,
      },
      create: {
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
      },
    });
  }
  console.log('✅ Default categories seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
