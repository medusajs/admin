import { Store, User } from "@medusajs/medusa"
import { AnalyticsBrowser, Traits } from "@segment/analytics-next"
import { useAdminGetSession, useAdminStore, useAdminUsers } from "medusa-react"
import React, { createContext, useContext, useEffect, useMemo } from "react"
import { useQuery } from "react-query"

type Props = {
  children?: React.ReactNode
  writeKey?: string
}

type Event =
  | "page_visited"
  | "num_products"
  | "num_orders"
  | "store_name"
  | "num_discounts"
  | "num_users"
  | "user_email"
  | "regions"
  | "currencies"
  | "error"

type AnalyticsContext = {
  track: (event: Event, properties?: Record<string, unknown>) => void
}

const AnalyticsContext = createContext<AnalyticsContext | null>(null)

const AnalyticsProvider = ({ children, writeKey }: Props) => {
  const { user } = useAdminGetSession()
  const { users: users } = useAdminUsers()
  const { store } = useAdminStore()

  const analytics = useMemo(() => {
    if (!writeKey) {
      return null
    }

    return AnalyticsBrowser.load({ writeKey })
  }, [writeKey])

  useEffect(() => {
    if (!analytics || !store || !user) {
      return
    }

    analytics.identify(user.id, getUserTraits(user, store, false))
  }, [analytics, user, users, store])

  const track = (event: Event, properties?: Record<string, unknown>) => {
    // ...
  }

  const trackPageVisited = (properties?: Record<string, unknown>) => {
    track("page_visited", properties)
  }

  const trackNumberOfProducts = (properties?: Record<string, unknown>) => {
    track("num_products", properties)
  }

  const trackNumberOfOrders = (properties?: Record<string, unknown>) => {
    track("num_orders", properties)
  }

  const trackNumberOfUsers = (properties?: Record<string, unknown>) => {
    track("num_users", properties)
  }

  const trackError = (properties?: Record<string, unknown>) => {
    track("error", properties)
  }

  const trackStoreName = (properties?: Record<string, unknown>) => {
    track("store_name", properties)
  }

  const trackUserEmail = (properties?: Record<string, unknown>) => {
    track("user_email", properties)
  }

  const trackRegions = (properties?: Record<string, unknown>) => {
    track("regions", properties)
  }

  const trackCurrencies = (properties?: Record<string, unknown>) => {
    track("currencies", properties)
  }

  const trackNumberOfDiscounts = (properties?: Record<string, unknown>) => {
    track("num_discounts", properties)
  }

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

const getUserTraits = (
  user: Omit<User, "password_hash">,
  store: Store,
  anonymized: boolean
): Traits => {
  return {
    email: anonymized ? "anonymized" : user.email,
    createdAt: user.created_at,
    company: {
      name: store.name,
    },
  }
}

const fetchAnalyticsPreference = async (
  identfier: string
): Promise<{ anonymized: boolean }> => {
  return fetch(`/preferences/${identfier}`).then(() => ({ anonymized: false }))
}

const useAdminAnalyticsPreference = (identifier?: string) => {
  const { data, ...rest } = useQuery(
    ["analytics", identifier],
    () => fetchAnalyticsPreference(identifier!),
    {
      enabled: !!identifier,
      retryDelay: 5000,
    }
  )

  return { ...data, ...rest }
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)

  if (context === undefined) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider")
  }

  return context
}

export default AnalyticsProvider
