import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-users-check-ins.repository'
import { randomUUID } from 'node:crypto'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

    await gymsRepository.create({
      title: 'Academia 1',
      phone: '123456789',
      description: 'Academia 1',
      latitude: -23.5063308,
      longitude: -46.757538,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: randomUUID(),
      gym_id: gymsRepository.gyms[0].id,
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      validateCheckInUseCase.execute({
        checkInId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      user_id: randomUUID(),
      gym_id: gymsRepository.gyms[0].id,
    })

    const TWENTY_ONE_MINUTES_IN_MS = 21 * 60 * 1000
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    await expect(
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
