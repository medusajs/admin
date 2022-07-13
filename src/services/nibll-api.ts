import axios, { AxiosResponse } from "axios"
import { useContext } from "react"
import { useMutation, useQuery, UseQueryOptions } from "react-query"
import { AccountContext } from "../context/account"

let baseURL = "http://localhost:3333"

if (process.env.GATSBY_STOREFRONT_API_URL) {
  baseURL = process.env.GATSBY_STOREFRONT_API_URL
}

export interface ProductReview {
  created_at: string
  [key: string]: any
}

export interface CancellationFeedback {
  created_at: string
  [key: string]: any
}

export interface Page<T> {
  data: T[]
  pageNumber: number
  pageSize: number
  totalResults: number
}

const client = axios.create({ baseURL })

type QueryOptions<T> = Omit<
  UseQueryOptions<T, any, T, string[]>,
  "queryKey" | "queryFn"
>

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
        `/api/user/impersonate/${customer_id}`,
        {},
        { headers: { Authorization: `Bearer ${api_token}` } }
      ),
    {
      onError,
      onSuccess,
    }
  )
}

export const useProductRatingsQuery = (
  query?: { pageNumber?: number; pageSize?: number },
  options?: QueryOptions<Page<ProductReview>>
) => {
  const { api_token } = useContext(AccountContext)
  const params = new URLSearchParams(query || ({} as any))
  const queryString = params.toString()

  return useQuery(
    ["product-reviews", queryString],
    () => {
      return client
        .get<Page<ProductReview>>(`/api/ratings/products?${queryString}`, {
          headers: { Authorization: `Bearer ${api_token}` },
        })
        .then((response) => response.data)
    },
    options
  )
}

export const useCancellationFeedbackQuery = (
  query?: { pageNumber?: number; pageSize?: number },
  options?: QueryOptions<Page<CancellationFeedback>>
) => {
  const { api_token } = useContext(AccountContext)
  const params = new URLSearchParams(query || ({} as any))
  const queryString = params.toString()

  return useQuery(
    ["cancellation-feedback", queryString],
    () => {
      return client
        .get<Page<CancellationFeedback>>(
          `/api/ratings/cancellations?${queryString}`,
          {
            headers: { Authorization: `Bearer ${api_token}` },
          }
        )
        .then((response) => response.data)
    },
    options
  )
}
