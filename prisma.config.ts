import { defineConfig, env } from 'prisma/config';

// Prisma 7 removed url/directUrl from schema.prisma — the CLI (generate, migrate, db pull)
// reads the connection from here instead. Runtime queries still go through DATABASE_URL
// via the PrismaPg adapter in core/services/prisma.service.ts.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
});
