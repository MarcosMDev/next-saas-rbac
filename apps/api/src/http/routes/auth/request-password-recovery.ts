import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function requestPasswordRecovery(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recovery',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recovery',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const useFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!useFromEmail) {
        return reply.status(201).send()
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVERY',
          userId: useFromEmail.id,
        },
      })

      // send email with password recovery link

      console.log('Password recovery code: ', code)

      return reply.status(201).send()
    },
  )
}
