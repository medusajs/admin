import { MedusaProvider } from "medusa-react"
import React from "react"
import "./src/assets/styles/emoji-picker.css"
import "./src/assets/styles/global.css"
import { WRITE_KEY } from "./src/components/constants/analytics"
import { LayeredModalProvider } from "./src/components/molecules/modal/layered-modal"
import { SteppedProvider } from "./src/components/molecules/modal/stepped-modal"
import ErrorBoundary from "./src/components/organisms/error-boundary"
import { AccountProvider } from "./src/context/account"
import AnalyticsProvider from "./src/context/analytics"
import { CacheProvider } from "./src/context/cache"
import { FeatureFlagProvider } from "./src/context/feature-flag"
import { InterfaceProvider } from "./src/context/interface"
import { medusaUrl, queryClient } from "./src/services/config"

export const wrapPageElement = ({ element }) => {
  return (
    <MedusaProvider
      baseUrl={medusaUrl}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <CacheProvider>
        <AccountProvider>
          <FeatureFlagProvider>
            <AnalyticsProvider writeKey={WRITE_KEY}>
              <InterfaceProvider>
                <SteppedProvider>
                  <LayeredModalProvider>
                    <ErrorBoundary>{element}</ErrorBoundary>
                  </LayeredModalProvider>
                </SteppedProvider>
              </InterfaceProvider>
            </AnalyticsProvider>
          </FeatureFlagProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}
