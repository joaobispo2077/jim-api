import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-users-check-ins.repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('shoud be able to get user metrics', async () => {
    const userId = 'user-01'

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: userId,
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: userId,
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId,
    })

    expect(checkInsCount).toBe(2)
  })
})
