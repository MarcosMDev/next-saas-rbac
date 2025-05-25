'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { CreateProject } from '@/http/create-project'

const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, description } = result.data

  const currentOrg = await getCurrentOrg()

  try {
    await CreateProject({
      org: currentOrg!,
      name,
      description,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'An unknown error occurred. Please try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Success! Your project has been created.',
    errors: null,
  }
}
