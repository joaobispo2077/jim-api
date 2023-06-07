import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Fetch Check-in history Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('shoud be able to fetch check-in history by user id', async () => {
    const title = 'Bravus Fitness'
    await gymsRepository.create({
      title,
      description:
        'Academia 100% preparada para receber qualquer um atleta desde o bom recebimento da recepção a qualidade de aparelhos e manutenção dos equipamentos. Administração impecável.  Super recomendo essa academia',
      phone: '011982147764',
      latitude: -23.5040702,
      longitude: -46.78697,
    })

    const query = title.slice(0, 4)
    const { gyms } = await searchGymsUseCase.execute({
      query,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms[0].title.includes(query)).toBeTruthy()
  })
})
