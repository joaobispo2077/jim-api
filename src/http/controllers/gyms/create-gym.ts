import { UserAlreadyExistsError } from '@src/use-cases/errors/user-already-exists-error'
import { makeCreateGymUseCase } from '@src/use-cases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createGym(request: FastifyRequest, reply: FastifyReply) {
  try {
    const createGymBodySchema = z.object({
      title: z.string(),
      description: z.string().nullable(),
      phone: z.coerce.string().nullable(),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { title, description, phone, latitude, longitude } =
      createGymBodySchema.parse(request.body)

    const createGymUseCase = makeCreateGymUseCase()

    await createGymUseCase.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return reply.status(201).send()
  } catch (error: any) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
