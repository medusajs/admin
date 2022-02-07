import { MedusaProvider } from "medusa-react"
import React from "react"
import { ToastProvider } from "react-toast-notifications"
import "./src/assets/styles/emoji-picker.css"
import "./src/assets/styles/global.css"
import { LayeredModalProvider } from "./src/components/molecules/modal/layered-modal"
import { SteppedProvider } from "./src/components/molecules/modal/stepped-modal"
import { AccountProvider } from "./src/context/account"
import { CacheProvider } from "./src/context/cache"
import { InterfaceProvider } from "./src/context/interface"
import { medusaUrl, queryClient } from "./src/services/config"
import { ThemeProvider as Provider } from "./src/theme"

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
          <InterfaceProvider>
            <ToastProvider autoDismiss={true} placement="bottom-left">
              <SteppedProvider>
                <LayeredModalProvider>
                  <Provider>{element}</Provider>
                </LayeredModalProvider>
              </SteppedProvider>
            </ToastProvider>
          </InterfaceProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}
