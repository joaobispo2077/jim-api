import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@src/repositories/check-ins-repository'
import { GymsRepository } from '@src/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export type CheckInUseCaseRequest = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}
export type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // TODO: calculate distance between user and gym

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error('User already checked in today')
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
