import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@src/app'
import { generateE2EUserToken } from '@src/utils/test/generate-e2e-user-token'

describe('Search gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to saerch gyms by title', async () => {
    const { token } = await generateE2EUserToken(app)
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

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia 1',
        phone: '123456789',
        description: 'Academia 1',
        latitude: -23.5063308,
        longitude: -46.757538,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Academia',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Academia 1',
        }),
        expect.objectContaining({
          title: 'Academia 2',
        }),
      ]),
    )
  })
})
