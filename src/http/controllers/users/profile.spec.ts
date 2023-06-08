import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@src/app'
import { generateE2EUserToken } from '@src/utils/test/generate-e2e-user-token'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to get profile data', async () => {
    const server = request(app.server)

    const name = 'John Doe'
    const email = 'john.doe@gmail.com'

    const { token } = await generateE2EUserToken(app)

    const response = await server
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          name,
          email,
        }),
      }),
    )
  })
})
