import { api } from './api-client'

export async function rejectInvite(invitedId: string) {
  await api.post(`invites/${invitedId}/reject`)
}
