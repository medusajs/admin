import { MedusaProvider } from "medusa-react"
import React from "react"
import "./src/assets/styles/emoji-picker.css"
import "./src/assets/styles/global.css"
import { LayeredModalProvider } from "./src/components/molecules/modal/layered-modal"
import { SteppedProvider } from "./src/components/molecules/modal/stepped-modal"
import { AccountProvider } from "./src/context/account"
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
            <InterfaceProvider>
              <SteppedProvider>
                <LayeredModalProvider>{element}</LayeredModalProvider>
              </SteppedProvider>
            </InterfaceProvider>
          </FeatureFlagProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}
