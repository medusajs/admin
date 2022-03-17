import axios from "axios"

let baseURL = "http://localhost:3333/api"

if (process.env.GATSBY_STOREFRONT_API_URL) {
  baseURL = process.env.GATSBY_STOREFRONT_API_URL
}

const client = axios.create({ baseURL })

export const impersonateCustomer = async (
  customer_id: string,
  api_key: string
): Promise<{ redirect_url: string }> => {
  const {
    data: { redirect_url },
  } = await client.post<{ redirect_url: string }>(
    `/user/impersonate/${customer_id}`,
    {},
    { headers: { Authorization: `Bearer ${api_key}` } }
  )
  return { redirect_url }
}
