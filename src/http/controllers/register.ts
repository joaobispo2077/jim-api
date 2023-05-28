import { PrismaUsersRepository } from '@src/repositories/prisma-users-repository'
import { UserAlreadyExistsError } from '@src/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@src/use-cases/register'
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

    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })

    return reply.status(201).send()
  } catch (error: any) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    // TODO: fix me
    return reply.status(500).send({ message: error.message })
  }
}
