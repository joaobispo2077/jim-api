import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-users-check-ins.repository'
import { CheckInUseCase } from './check-in'
import { randomUUID } from 'node:crypto'

let checkInsRepository: InMemoryCheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository)

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
    })

    await expect(
      checkInUseCase.execute({
        userId,
        gymId,
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
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId,
      gymId,
    })

    expect(checkIn.created_at).toEqual(expect.any(Date))
  })
})
