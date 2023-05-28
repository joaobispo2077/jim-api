import { Prisma, User } from '@prisma/client'
import { prisma } from '@src/lib/prisma'
import { UsersRepository } from './users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const isUserAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return isUserAlreadyExists
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }
}