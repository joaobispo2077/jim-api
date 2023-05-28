import { registerUseCase } from '@src/use-cases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = userBodySchema.parse(request.body)
    await registerUseCase({
      name,
      email,
      password,
    })

    return reply.status(201).send()
  } catch (error: any) {
    return reply.status(400).send({ message: error.message })
  }
}
