import { CheckInsRepository } from '@src/repositories/check-ins-repository'

export type GetUserMetricsUseCaseRequest = {
  userId: string
}
export type GetUserMetricsUseCaseResponse = {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
