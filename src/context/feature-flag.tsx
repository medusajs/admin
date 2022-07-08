import { useAdminStore } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { AccountContext } from "./account"
import { FeatureToggleProvider } from "react-feature-toggles"

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

  const toggles = featureFlags.reduce(
    (acc, flag) => ({ [flag]: true, ...acc }),
    {}
  )

  return (
    <FeatureToggleProvider featureToggleList={toggles}>
      {children}
    </FeatureToggleProvider>
  )
}
