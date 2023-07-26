import { Prisma } from '@prisma/client'
import { configs } from '@src/configs'
import { prisma } from '@src/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export type GenerateE2EUserTokenResponse = { token: string }

export async function generateE2EUserToken(
  app: FastifyInstance,
  userData?: Partial<Prisma.UserCreateInput>,
): Promise<GenerateE2EUserTokenResponse> {
  const server = request(app.server)

  const name = 'John Doe'
  const email = 'john.doe@gmail.com'
  const password = '12345678'
  const defaultRole = 'MEMBER'

  await prisma.user.create({
    data: {
      name: userData?.name ?? name,
      email: userData?.email ?? email,
      role: userData?.role ?? defaultRole,
      password_hash: await hash(
        userData?.password_hash ?? password,
        configs.SALT_ROUND,
      ),
    },
  })

  const { body } = await server.post('/sessions').send({
    email: userData?.email ?? email,
    password: userData?.password_hash ?? password,
  })

  return { token: body.token } as GenerateE2EUserTokenResponse
}
