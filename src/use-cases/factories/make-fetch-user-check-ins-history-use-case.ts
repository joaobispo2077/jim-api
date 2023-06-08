import { PrismaCheckInsRepository } from '@src/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  return new FetchUserCheckInsHistoryUseCase(prismaCheckInsRepository)
}
