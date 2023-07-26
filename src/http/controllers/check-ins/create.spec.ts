import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@src/app'
import { generateE2EUserToken } from '@src/utils/test/generate-e2e-user-token'

describe('Create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to create a check-in', async () => {
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

    const responseSearchGyms = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Bravus',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    const { id } = responseSearchGyms.body.gyms[0]
    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.5040702,
        longitude: -46.78697,
      })

    expect(response.status).toBe(201)
  })
})
