import React from "react"
import "./src/assets/styles/global.css"
import { CacheProvider } from "./src/context/cache"
import { AccountProvider } from "./src/context/account"
import { InterfaceProvider } from "./src/context/interface"
import { ThemeProvider as Provider } from "./src/theme"
import { ToastProvider } from "react-toast-notifications"
import { MedusaProvider } from "medusa-react"
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
          <InterfaceProvider>
            <ToastProvider autoDismiss={true} placement="bottom-left">
              <Provider>{element}</Provider>
            </ToastProvider>
          </InterfaceProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}
