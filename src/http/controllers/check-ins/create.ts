import { makeCheckInUseCase } from '@src/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const userId = request.user.sub

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userId,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
