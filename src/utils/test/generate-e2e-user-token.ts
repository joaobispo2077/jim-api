import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function generateE2EUserToken(app: FastifyInstance) {
  const server = request(app.server)

  const name = 'John Doe'
  const email = 'john.doe@gmail.com'
  const password = '12345678'

  await server.post('/users').send({
    name,
    email,
    password,
  })

  const { body } = await server.post('/sessions').send({
    email,
    password,
  })

  return { token: body.token }
}
