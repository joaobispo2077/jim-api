import { configs } from '@src/configs'
import { InvalidCredentialsError } from '@src/use-cases/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({
      onlyCookie: true,
    })

    const { user } = request
    const { role } = user

    const token = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: user.sub,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: user.sub,
        },
      },
    )

    return reply
      .setCookie(configs.COOKIE_REFRESH_TOKEN_NAME, refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (error: any) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
