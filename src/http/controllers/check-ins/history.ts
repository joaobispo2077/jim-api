import { makeFetchUserCheckInsHistoryUseCase } from '@src/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const fetchCheckInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchCheckInsHistoryQuerySchema.parse(request.query)
  const userId = request.user.sub

  const fetchCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchCheckInsHistoryUseCase.execute({
    page,
    userId,
  })

  return reply.send({ checkIns })
}
