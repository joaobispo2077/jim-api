import { PrismaUsersRepository } from '@src/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  return new AuthenticateUseCase(prismaUsersRepository)
}
