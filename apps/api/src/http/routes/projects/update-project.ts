import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request) => {
        const { orgSlug, projectSlug } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(orgSlug)

        const project = await prisma.project.findFirst({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError(
            'Project not found. Please check the project slug.',
          )
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Project')) {
          throw new UnauthorizedError(
            'You do not have permission to update projects in this organization.',
          )
        }

        const { name, description } = request.body

        await prisma.project.update({
          where: {
            id: project.id,
          },
          data: {
            name,
            description,
          },
        })
      },
    )
}
