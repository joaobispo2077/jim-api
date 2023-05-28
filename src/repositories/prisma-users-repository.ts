import { Prisma } from '@prisma/client'
import { prisma } from '@src/lib/prisma'
import { UsersRepository } from './users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }
}
