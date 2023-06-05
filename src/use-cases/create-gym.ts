import type { Gym } from '@prisma/client'
import { GymsRepository } from '@src/repositories/gyms-repository'

export type CreateGymUseCaseRequest = {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export type CreateGymUseCaseResponse = {
  gym: Gym
}
export class CreateGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
