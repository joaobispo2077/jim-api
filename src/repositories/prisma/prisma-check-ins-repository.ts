import { CheckIn, Prisma } from '@prisma/client'
import { prisma } from '@src/lib/prisma'
import { CheckInsRepository } from '../check-ins-repository'
import { configs } from '@src/configs'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string): Promise<CheckIn | null> {
    return await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * configs.DEFAULT_PER_PAGE,
      take: configs.DEFAULT_PER_PAGE,
    })

    return checkIns
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return await prisma.checkIn.create({ data })
  }

  async update(
    id: string,
    data: Prisma.CheckInUncheckedUpdateInput,
  ): Promise<CheckIn> {
    return await prisma.checkIn.update({
      where: {
        id,
      },
      data,
    })
  }
}
