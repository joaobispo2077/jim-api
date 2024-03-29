import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
} from 'vitest'
import request from 'supertest'
import { app } from '@src/app'
import { generateE2EUserToken } from '@src/utils/test/generate-e2e-user-token'

describe('Check-in validation (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check-in', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
    const { token } = await generateE2EUserToken(app, {
      role: 'ADMIN',
    })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Bravus Fitness 2',
        description:
          'Academia 100% preparada para receber qualquer um atleta desde o bom recebimento da recepção a qualidade de aparelhos e manutenção dos equipamentos. Administração impecável.  Super recomendo essa academia',
        phone: '011982147764',
        latitude: -23.5040702,
        longitude: -46.78697,
      })
    const server = request(app.server)
    const responseSearchGyms = await server
      .get('/gyms/search')
      .query({
        query: 'Bravus',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    const { id } = responseSearchGyms.body.gyms[0]

    await server
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.5040702,
        longitude: -46.78697,
      })

    const responseCheckInsHistory = await server
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const checkInId = responseCheckInsHistory.body.checkIns[0]?.id

    vi.setSystemTime(new Date(2023, 0, 1, 13, 45))

    const response = await server
      .patch(`/check-ins/${checkInId}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const responseCheckInsHistoryToBeValidated = await server
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const { validated_at } =
      responseCheckInsHistoryToBeValidated.body.checkIns[0]

    expect(response.status).toBe(204)
    expect(validated_at).not.toBeNull()
    expect(validated_at).toEqual(expect.any(String))
  })
})
