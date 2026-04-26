// 수동 마이그레이션: Prisma migrate deploy가 실패할 경우 직접 SQL 실행
const { PrismaClient } = require('@prisma/client');

async function runMigration() {
  const prisma = new PrismaClient();
  try {
    // User 테이블에 소셜 로그인 필드 추가
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "social_id" TEXT;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
    `);
    // unique index
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_social_id_key" ON "User"("provider", "social_id");
    `);
    console.log('Migration: social login columns added successfully');
  } catch (err) {
    console.log('Migration: columns may already exist -', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
