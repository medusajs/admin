import { AdminAnalyticsConfigRes } from "@medusajs/medusa"
import { AnalyticsBrowser } from "@segment/analytics-next"
import axios from "axios"
import { useMutation, useQuery } from "react-query"

export const analytics = AnalyticsBrowser.load({ writeKey: "YOUR_WRITE_KEY" })

let baseURL = "http://localhost:9000"

// deprecated
if (process.env.GATSBY_STORE_URL) {
  baseURL = process.env.GATSBY_STORE_URL
}

// takes precedence over GATSBY_STORE_URL
if (process.env.GATSBY_MEDUSA_BACKEND_URL) {
  baseURL = process.env.GATSBY_MEDUSA_BACKEND_URL
}

// API

const client = axios.create({
  baseURL: `${baseURL}/admin/analytics-configs`,
  withCredentials: true,
})

/**
 * Fetches the analytics config for the current user.
 */
export const getAnalyticsConfig = async (): Promise<
  AdminAnalyticsConfigRes
> => {
  const { data } = await client.get("/")
  return data
}

type CreateConfigPayload = {
  opt_out: boolean
  anonymize?: boolean
}

/**
 * Creates a new analytics config for the current user.
 */
export const createAnalyticsConfig = async (
  payload: CreateConfigPayload
): Promise<AdminAnalyticsConfigRes> => {
  const { data } = await client.post("/", payload)
  return data
}

type UpdateConfigPayload = {
  opt_out?: boolean
  anonymize?: boolean
}

/**
 * Updates the users analytics config
 */
export const updateAnalyticsConfig = async (
  payload: UpdateConfigPayload
): Promise<AdminAnalyticsConfigRes> => {
  const { data } = await client.post("/update", payload)
  return data
}

// Hooks

export const useAdminAnalyticsConfig = (identifier?: string) => {
  const { data, ...rest } = useQuery(
    ["analytics", identifier],
    () => getAnalyticsConfig(),
    {
      enabled: !!identifier,
      retry: false,
    }
  )

  return { ...data, ...rest }
}

export const useAdminUpdateAnalyticsConfig = (identifier?: string) => {
  const mutation = useMutation(
    ["analytics", identifier],
    (payload: UpdateConfigPayload) => updateAnalyticsConfig(payload)
  )

  return mutation
}
