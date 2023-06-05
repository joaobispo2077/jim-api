import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-users-check-ins.repository'
import { CheckInUseCase } from './check-in'
import { randomUUID } from 'node:crypto'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
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
      latitude: -23.5063308,
      longitude: -46.757538,
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
      gymId: gymsRepository.gyms[0].id,
      userLatitude: -23.5065763,
      userLongitude: -46.7572729,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('shoud not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const userId = randomUUID()
    const gymId = gymsRepository.gyms[0].id

    await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -23.5065763,
      userLongitude: -46.7572729,
    })

    await expect(
      checkInUseCase.execute({
        userId,
        gymId,
        userLatitude: -23.5065763,
        userLongitude: -46.7572729,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('shoud be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const userId = randomUUID()
    const gymId = gymsRepository.gyms[0].id

    await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -23.5065763,
      userLongitude: -46.7572729,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -23.5065763,
      userLongitude: -46.7572729,
    })

    expect(checkIn.created_at).toEqual(expect.any(Date))
  })

  it('shoud not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      name: 'Academia 2',
      phone: '123456789',
      description: 'Academia 2',
      latitude: -23.5807332,
      longitude: -46.6499799,
    })

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await expect(
      checkInUseCase.execute({
        userId: randomUUID(),
        gymId: gymsRepository.gyms[1].id,
        userLatitude: -23.4685011,
        userLongitude: -46.5754483,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
