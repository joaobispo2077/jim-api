import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@src/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export type ValidateCheckInUseCaseRequest = {
  checkInId: string
}

export type ValidateCheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()
    await this.checkInsRepository.update(checkInId, checkIn)

    return {
      checkIn,
    }
  }
}
