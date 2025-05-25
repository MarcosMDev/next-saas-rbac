import { api } from './api-client'

interface GetShutdownOrganizationRequest {
  org: string
}

export async function shutdownOrganization({
  org,
}: GetShutdownOrganizationRequest) {
  await api.delete(`organizations/${org}`)
}
