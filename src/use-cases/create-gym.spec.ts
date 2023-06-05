import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Gym creation Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Bravus Fitness 2',
      description:
        'Academia 100% preparada para receber qualquer um atleta desde o bom recebimento da recepção a qualidade de aparelhos e manutenção dos equipamentos. Administração impecável.  Super recomendo essa academia',
      phone: '011982147764',
      latitude: -23.5040702,
      longitude: -46.78697,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
