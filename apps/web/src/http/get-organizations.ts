import { api } from './api-client'

interface GetOrganizationResponse {
  organizations: {
    id: string
    name: string
    email: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const result = await api
    .get('organizations', {
      next: {
        tags: ['organizations'],
      },
    })
    .json<GetOrganizationResponse>()

  return result
}
