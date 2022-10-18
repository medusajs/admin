import { Store, User } from "@medusajs/medusa"
import { useLocation } from "@reach/router"
import { Traits } from "@segment/analytics-next"
import { useAdminGetSession, useAdminStore, useAdminUsers } from "medusa-react"
import React, { createContext, useContext, useEffect, useMemo } from "react"
import Fade from "../components/atoms/fade-wrapper"
import AnalyticsPreferencesModal from "../components/organisms/analytics-preferences"
import { useDebounce } from "../hooks/use-debounce"
import {
  analytics,
  useAdminAnalyticsConfig,
  useAdminCreateAnalyticsConfig,
} from "../services/analytics"
import { useFeatureFlag } from "./feature-flag"

type Props = {
  children?: React.ReactNode
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
  trackCurrencies: (properties: CurrenciesProperties) => void
  trackNumberOfOrders: (properties: OrdersProperties) => void
  trackNumberOfDiscounts: (properties: DiscountsProperties) => void
  trackNumberOfProducts: (properties: ProductsProperties) => void
  trackRegions: (properties: RegionsProperties) => void
}

const AnalyticsContext = createContext<AnalyticsContext | null>(null)

const AnalyticsProvider = ({ children }: Props) => {
  const { user } = useAdminGetSession()
  const { users: users } = useAdminUsers()
  const { store } = useAdminStore()
  const { analytics_config, isLoading } = useAdminAnalyticsConfig(user?.id)
  const { mutate, isLoading: isSubmitting } = useAdminCreateAnalyticsConfig(
    user?.id
  )

  const { isFeatureEnabled } = useFeatureFlag()

  const askPermission = useMemo(() => {
    if (!isFeatureEnabled("analytics")) {
      return false
    }

    return !analytics_config && !isLoading
  }, [analytics_config, isLoading])

  /**
   * Used to ensure that the focus modal is animated smoothly.
   */
  const animateIn = useDebounce(askPermission, 1000)

  useEffect(() => {
    if (!store || !user) {
      return
    }

    analytics.identify(user.id, getUserTraits(user, store, false))
  }, [analytics, user, store])

  useEffect(() => {
    if (!analytics_config) {
      return
    }

    if (users) {
      trackNumberOfUsers({
        num_users: users.length,
      })
    }

    if (store) {
      trackStoreName({
        store_name: store.name,
      })
    }
  }, [users, analytics_config, store])

  const wasTrackedToday = (event: Event) => {
    const today = new Date()
    const todayString = today.toDateString()

    const eventKey = `${event}_tracked_at`

    const lastTracked = localStorage.getItem(eventKey)

    if (lastTracked === todayString) {
      return true
    }

    localStorage.setItem(eventKey, todayString)

    return false
  }

  const track = (event: Event, properties?: Record<string, unknown>) => {
    if (!user || !analytics_config || analytics_config.opt_out) {
      return
    }

    if (wasTrackedToday(event) && event !== "page_visited") {
      return
    }

    console.log(event, properties, "tracked")
    // analytics.track(event, properties)
  }

  const trackPageVisited = (properties: PageProperties) => {
    track("page_visited", properties)
  }

  const trackNumberOfProducts = (properties: ProductsProperties) => {
    track("num_products", properties)
  }

  const trackNumberOfOrders = (properties: OrdersProperties) => {
    track("num_orders", properties)
  }

  const trackNumberOfUsers = (properties: UsersProperties) => {
    track("num_users", properties)
  }

  const trackStoreName = (properties: StoreNameProperties) => {
    track("store_name", properties)
  }

  const trackUserEmail = (properties: EmailProperties) => {
    track("user_email", properties)
  }

  const trackRegions = (properties: RegionsProperties) => {
    track("regions", properties)
  }

  const trackCurrencies = (properties: CurrenciesProperties) => {
    track("currencies", properties)
  }

  const trackNumberOfDiscounts = (properties: DiscountsProperties) => {
    track("num_discounts", properties)
  }

  // Track pages visited when location changes

  const { pathname } = useLocation()

  useEffect(() => {
    if (!pathname) {
      return
    }

    trackPageVisited({ url: pathname })
  }, [pathname])

  return (
    <AnalyticsContext.Provider
      value={{
        trackRegions,
        trackCurrencies,
        trackNumberOfOrders,
        trackNumberOfProducts,
        trackNumberOfDiscounts,
      }}
    >
      {user && askPermission && (
        <Fade isVisible={animateIn} isFullScreen={true}>
          <AnalyticsPreferencesModal user={user} />
        </Fade>
      )}
      {children}
    </AnalyticsContext.Provider>
  )
}

type CurrenciesProperties = {
  used_currencies: string[]
}

type OrdersProperties = {
  num_orders: number
}

type ProductsProperties = {
  num_products: number
}

type UsersProperties = {
  num_users: number
}

type RegionsProperties = {
  regions: string[]
  num_regions: number
}

type DiscountsProperties = {
  num_discounts: number
}

type EmailProperties = {
  email: string
}

type StoreNameProperties = {
  store_name: string
}

type PageProperties = {
  url: string
}

const getUserTraits = (
  user: Omit<User, "password_hash">,
  store: Store,
  anonymized: boolean
): Traits => {
  return {
    email: anonymized ? `anonymized@${store.name}.com` : user.email,
    createdAt: user.created_at,
    company: {
      name: store.name,
    },
  }
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider")
  }

  return context
}

export default AnalyticsProvider
