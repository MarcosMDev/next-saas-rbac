import { api } from './api-client'

export async function acceptInvite(invitedId: string) {
  await api.post(`invites/${invitedId}/accept`)
}
