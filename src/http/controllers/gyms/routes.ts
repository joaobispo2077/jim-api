import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@src/http/middlewares/verify-jwt'
import { search } from './search-gyms'
import { createGym } from './create-gym'

export async function setupGymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('gyms/search', search)
  app.get('gyms/nearby', search)

  app.post('gyms', createGym)
}
