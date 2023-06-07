import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public readonly checkins: CheckIn[] = []

  async findById(id: string): Promise<CheckIn | null> {
    return this.checkins.find((checkin) => checkin.id === id) || null
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDay = this.checkins.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      const isSameUser = checkIn.user_id === userId
      return isOnSameDate && isSameUser
    })

    return checkOnSameDay || null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.checkins.push(checkIn)
    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkins
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkins.filter((checkIn) => checkIn.user_id === userId).length
  }

  async update(id: string, data: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkins.findIndex((checkIn) => checkIn.id === id)

    if (checkInIndex === -1) {
      throw new Error('Check-in not found')
    }

    const checkIn = this.checkins[checkInIndex]

    const updatedCheckIn = {
      ...checkIn,
      ...data,
    }

    this.checkins[checkInIndex] = updatedCheckIn

    return updatedCheckIn
  }
}
