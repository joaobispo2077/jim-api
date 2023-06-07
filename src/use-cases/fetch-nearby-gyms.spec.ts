import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Find Many Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to find many nearby gyms by user latitude & longitude', async () => {
    await Promise.allSettled([
      gymsRepository.create({
        title: 'Academia 1',
        phone: '123456789',
        description: 'Academia 1',
        latitude: -23.5063308,
        longitude: -46.757538,
      }),
      gymsRepository.create({
        title: 'Academia 2',
        phone: '123456789',
        description: 'Academia 2',
        latitude: -23.5807332,
        longitude: -46.6499799,
      }),
      gymsRepository.create({
        title: 'Bravus Fitness',
        description:
          'Academia 100% preparada para receber qualquer um atleta desde o bom recebimento da recepção a qualidade de aparelhos e manutenção dos equipamentos. Administração impecável.  Super recomendo essa academia',
        phone: '011982147764',
        latitude: -23.5040702,
        longitude: -46.78697,
      }),
    ])

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -23.5065763,
      userLongitude: -46.7572729,
    })

    expect(gyms).toHaveLength(2)
  })
})
