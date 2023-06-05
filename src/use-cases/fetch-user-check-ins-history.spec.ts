import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-users-check-ins.repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let fetchCheckInUseCase: FetchUserCheckInsHistoryUseCase

describe('Fetgch Check-in history Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchCheckInUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
    )
  })

  afterEach(() => {})

  it('shoud be able to fetch check-in history by user id', async () => {
    const userId = 'user-01'

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: userId,
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: userId,
    })

    const { checkIns } = await fetchCheckInUseCase.execute({
      userId,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gym_id: 'gym-01',
        }),
        expect.objectContaining({
          gym_id: 'gym-02',
        }),
      ]),
    )
  })
  it('should be able to fetch paginated check-in history', async () => {
    const userId = 'user-01'

    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index}`,
        user_id: userId,
      })
    }

    const { checkIns } = await fetchCheckInUseCase.execute({
      userId,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gym_id: 'gym-21',
        }),
        expect.objectContaining({
          gym_id: 'gym-22',
        }),
      ]),
    )
  })
})
