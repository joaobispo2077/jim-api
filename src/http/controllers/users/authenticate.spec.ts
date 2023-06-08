import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@src/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to authenticate', async () => {
    const email = 'john.doe@gmail.com'
    const password = '12345678'

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password,
    })

    const response = await request(app.server).post('/sessions').send({
      email,
      password,
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.token).toEqual(expect.any(String))
  })
})
