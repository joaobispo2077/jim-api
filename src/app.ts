import fastify from 'fastify'
import { setupRoutes } from './http/routes'

export const app = fastify()
app.register(setupRoutes)
