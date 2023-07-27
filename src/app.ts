import fastify from 'fastify'
import { setupUsersRoutes } from './http/controllers/users/routes'
import { setupGymsRoutes } from './http/controllers/gyms/routes'
import { setupCheckInRoutes } from './http/controllers/check-ins/routes'
import { ZodError } from 'zod'
import { configs } from './configs'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import pkg from '../package.json'

export const app = fastify()

const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      title: pkg.name,
      description: pkg.description,
      version: pkg.version,
    },
    host: configs.SWAGGER_HOST,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'Default', description: 'Default' }],
  },
}

const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
}

app.register(fastifySwagger, swaggerOptions)
app.register(fastifySwaggerUi, swaggerUiOptions)

app.register(fastifyJwt, {
  secret: configs.JWT_SECRET,
  cookie: {
    cookieName: configs.COOKIE_REFRESH_TOKEN_NAME,
    signed: false,
  },
  sign: {
    expiresIn: configs.JWT_EXPIRES_IN,
  },
})
app.register(fastifyCookie)
app.register(setupUsersRoutes)
app.register(setupGymsRoutes)
app.register(setupCheckInRoutes)

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
