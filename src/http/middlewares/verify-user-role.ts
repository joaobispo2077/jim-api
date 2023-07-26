import { FastifyReply, FastifyRequest } from 'fastify'

export const verifyUserRole =
  (roleToVerify: 'ADMIN' | 'MEMBER') =>
  async (request: FastifyRequest, response: FastifyReply) => {
    try {
      const { role } = request.user

      if (role !== roleToVerify) {
        response.status(401).send({
          message: 'Unauthorized',
        })
      }
    } catch (error) {
      response.status(401).send({
        message: 'Unauthorized',
      })
    }
  }
