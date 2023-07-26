import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@src/app'
import { generateE2EUserToken } from '@src/utils/test/generate-e2e-user-token'

describe('Find nearby gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to find nearby gyms by latitude & longitude', async () => {
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

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia 2',
        phone: '123456789',
        description: 'Academia 2',
        latitude: -23.5807332,
        longitude: -46.6499799,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.5063308,
        longitude: -46.757538,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Bravus Fitness 2',
        }),
      ]),
    )
  })
})
