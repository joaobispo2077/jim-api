import { PrismaGymsRepository } from '@src/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@src/repositories/prisma/prisma-check-ins-repository'

export function makeCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  return new CheckInUseCase(prismaCheckInsRepository, gymsRepository)
}
