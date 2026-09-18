import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ENV_KEYS, requireEnv } from '@/core/constants';

let client: PrismaClient | undefined;

const connect = (): PrismaClient =>
  (client ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString: requireEnv(ENV_KEYS.databaseUrl) }),
  }));

/**
 * A lazy proxy rather than a client, because the services barrel that re-exports this is imported
 * by client components too. Instantiating at module scope read DATABASE_URL during the build and
 * pulled Prisma into the browser bundle; nothing here runs until a query is actually made.
 * Methods are bound to the real client so `this` never lands on the proxy.
 */
export const prisma: PrismaClient = /*#__PURE__*/ new Proxy({} as PrismaClient, {
  get: (_target, property) => {
    const instance = connect();
    const value = Reflect.get(instance, property);

    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
