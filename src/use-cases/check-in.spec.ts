import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-users-check-ins.repository'
import { CheckInUseCase } from './check-in'
import { randomUUID } from 'node:crypto'
import { GymsRepository } from '@src/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: GymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      name: 'Academia 1',
      phone: '123456789',
      description: 'Academia 1',
      latitude: 0,
      longitude: 0,
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shoud be able to check in', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('shoud not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const userId = randomUUID()
    const gymId = randomUUID()

    await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      checkInUseCase.execute({
        userId,
        gymId,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('shoud be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const userId = randomUUID()
    const gymId = randomUUID()

    await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.created_at).toEqual(expect.any(Date))
  })
})
