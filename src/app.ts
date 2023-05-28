import fastify from 'fastify'
import { setupRoutes } from './http/routes'
import { ZodError } from 'zod'
import { configs } from './configs'

export const app = fastify()
app.register(setupRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(422)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (configs.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
