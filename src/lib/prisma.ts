import { PrismaClient } from '@prisma/client'
import { configs } from '../configs'

export const prisma = new PrismaClient({
  log: configs.getPrismaClientLogLevel(),
})
