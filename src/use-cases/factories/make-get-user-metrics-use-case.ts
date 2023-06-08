import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@src/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  return new GetUserMetricsUseCase(prismaCheckInsRepository)
}
