import { prisma } from '@src/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { configs } from '@src/configs'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = userBodySchema.parse(request.body)
  const passwordHash = await hash(password, configs.SALT_ROUND)

  const isUserAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (isUserAlreadyExists) {
    return reply.status(409).send()
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })

  return reply.status(201).send()
}
