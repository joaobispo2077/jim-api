import 'dotenv/config'
import { z } from 'zod'

const configSchema = z.object({
  SALT_ROUND: z.coerce.number().default(6),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PRISMA_CLIENT_LOG_LEVEL: z
    .enum(['info', 'query', 'warn', 'error'])
    .default('error'),
  DEFAULT_PER_PAGE: z.coerce.number().default(20),
  DEFAULT_PAGE: z.coerce.number().default(1),
  DEFAULT_MAX_NEARBY_DISTANCE_IN_KM: z.coerce.number().default(10),
})

const _configs = configSchema.safeParse(process.env)

if (!_configs.success) {
  console.error(`Invalid environment variables`, _configs.error.format())
  throw new Error(`Invalid environment variables`)
}

export const configs = {
  ..._configs.data,
  getPrismaClientLogLevel() {
    if (configs.NODE_ENV === 'production') {
      return []
    }

    return [this.PRISMA_CLIENT_LOG_LEVEL]
  },
}
