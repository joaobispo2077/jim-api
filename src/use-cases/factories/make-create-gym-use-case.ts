import { CreateGymUseCase } from '../create-gym'
import { PrismaGymsRepository } from '@src/repositories/prisma/prisma-gyms-repository'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  return new CreateGymUseCase(gymsRepository)
}
