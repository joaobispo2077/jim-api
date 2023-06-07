import type { Gym } from '@prisma/client'
import { GymsRepository } from '@src/repositories/gyms-repository'

export type SearchGymsUseCaseRequest = {
  query: string
  page: number
}

export type SearchGymsUseCaseResponse = {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
