import { api } from './api-client'

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

interface GetBillingRequest {
  org: string
}

export async function getBilling({ org }: GetBillingRequest) {
  const result = await api
    .get(`organizations/${org}/billing`)
    .json<GetBillingResponse>()

  return result
}
