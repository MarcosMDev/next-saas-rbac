'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { CreateOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Name must be at least 4 characters long.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return domainRegex.test(value)
          }

          return true
        },
        { message: 'Please, enter a valid domain' },
      ),
    shouldAttachUserByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUserByDomain && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'Please, enter a domain to attach users by domain',
      path: ['domain'],
    },
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUserByDomain } = result.data

  try {
    await CreateOrganization({
      name,
      domain,
      shouldAttachUserByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Success! Your organization has been created.',
    errors: null,
  }
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUserByDomain } = result.data

  try {
    await updateOrganization({
      org: currentOrg!,
      name,
      domain,
      shouldAttachUserByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Success! Your organization has been created.',
    errors: null,
  }
}
