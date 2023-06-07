import type { Gym } from '@prisma/client'
import { GymsRepository } from '@src/repositories/gyms-repository'

export type FetchNearbyGymsUseCaseRequest = {
  userLatitude: number
  userLongitude: number
}

export type FetchNearbyGymsUseCaseResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
