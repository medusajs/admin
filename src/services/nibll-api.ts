import axios, { AxiosResponse } from "axios"
import { useContext } from "react"
import { useMutation } from "react-query"
import { AccountContext } from "../context/account"

let baseURL = "http://localhost:3333/api"

if (process.env.GATSBY_STOREFRONT_API_URL) {
  baseURL = process.env.GATSBY_STOREFRONT_API_URL
}

const client = axios.create({ baseURL })

export interface UseMutationCallbackOptions<TData> {
  onError?: (err: any) => void
  onSuccess?: (data: TData) => void
}

export const useImpersonateCustomer = ({
  onError,
  onSuccess,
}: UseMutationCallbackOptions<AxiosResponse<{ redirect_url: string }>>) => {
  const { api_token } = useContext(AccountContext)

  return useMutation(
    (customer_id: string) =>
      client.post<{ redirect_url: string }>(
        `/user/impersonate/${customer_id}`,
        {},
        { headers: { Authorization: `Bearer ${api_token}` } }
      ),
    {
      onError,
      onSuccess,
    }
  )
}
