import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { requireEnv } from '@/core/constants';

const adapter = new PrismaPg({ connectionString: requireEnv('DATABASE_URL') });
export const prisma = new PrismaClient({ adapter });
