import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@src/http/middlewares/verify-jwt'
import { createCheckIn } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'

export async function setupCheckInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch('/check-ins/:checkInId/validate', validate)
}
