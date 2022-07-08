import { useAdminStore } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { AccountContext } from "./account"

export const defaultFeatureFlagContext: {
  featureToggleList: Record<string, boolean>
  isFeatureEnabled: (flag: string) => boolean
} = {
  featureToggleList: {},
  isFeatureEnabled: function (flag): boolean {
    return !!this.featureToggleList[flag]
  },
}

export const FeatureFlagContext = React.createContext(defaultFeatureFlagContext)

export const FeatureFlagProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AccountContext)

  const [featureFlags, setFeatureFlags] = useState<string[]>([])

  const { store, isFetching } = useAdminStore()

  useEffect(() => {
    if (isFetching || !store || !isLoggedIn) {
      return
    }

    setFeatureFlags(store["feature_flags"])
  }, [isFetching, store, isLoggedIn])

  const featureToggleList = featureFlags.reduce(
    (acc, flag) => ({ [flag]: true, ...acc }),
    {}
  )

  const isFeatureEnabled = (flag: string) => !!featureToggleList[flag]

  return (
    <FeatureFlagContext.Provider
      value={{ isFeatureEnabled, featureToggleList }}
    >
      {children}
    </FeatureFlagContext.Provider>
  )
}
