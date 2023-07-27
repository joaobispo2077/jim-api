import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@src/http/middlewares/verify-jwt'
import { refresh } from './refresh'

export async function setupUsersRoutes(app: FastifyInstance) {
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: {
          type: 'object',
          required: ['name', 'email', 'password'],

          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    register,
  )

  app.post('/sessions', authenticate)

  app.patch('/tokens', refresh)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
