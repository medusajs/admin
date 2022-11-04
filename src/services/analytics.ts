import { AdminAnalyticsConfigRes } from "@medusajs/medusa"
import { AnalyticsBrowser } from "@segment/analytics-next"
import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { WRITE_KEY } from "../components/constants/analytics"
import { useFeatureFlag } from "../context/feature-flag"

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

// Analytics instance used for tracking one-off events, such as errors and the initial permission request
export const analytics = AnalyticsBrowser.load({
  writeKey: WRITE_KEY,
})

/**
 * Fetches the analytics config for the current user.
 */
export const getAnalyticsConfig =
  async (): Promise<AdminAnalyticsConfigRes> => {
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

const ANALYTICS_CONFIG_KEY = ["analytics-config"]

const useInvalidateAnalyticsConfig = () => {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries(ANALYTICS_CONFIG_KEY)
  }
}

export const useAdminAnalyticsConfig = () => {
  const { isFeatureEnabled } = useFeatureFlag()

  const { data, ...rest } = useQuery(
    ANALYTICS_CONFIG_KEY,
    () => getAnalyticsConfig(),
    {
      retry: false,
      enabled: isFeatureEnabled("analytics"),
    }
  )

  return { ...data, ...rest }
}

export const useAdminUpdateAnalyticsConfig = () => {
  const invalidateAnalyticsConfig = useInvalidateAnalyticsConfig()

  const mutation = useMutation(
    (payload: UpdateConfigPayload) => updateAnalyticsConfig(payload),
    {
      onSuccess: invalidateAnalyticsConfig,
    }
  )

  return mutation
}

export const useAdminCreateAnalyticsConfig = () => {
  const invalidateAnalyticsConfig = useInvalidateAnalyticsConfig()

  const mutation = useMutation(
    (payload: CreateConfigPayload) => createAnalyticsConfig(payload),
    {
      onSuccess: invalidateAnalyticsConfig,
    }
  )

  return mutation
}
