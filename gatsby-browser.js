import "./src/assets/styles/global.css"
import React from "react"
import { CacheProvider } from "./src/context/cache"
import { AccountProvider } from "./src/context/account"
import { InterfaceProvider } from "./src/context/interface"
import { ThemeProvider as Provider } from "./src/theme"
import { ToastProvider } from "react-toast-notifications"
import { MedusaProvider } from "medusa-react"
import { QueryClient } from "react-query"

//export const shouldUpdateScroll = ({ routerProps: { location } }) => {
//  window.scrollTo(0, 0)
//  return false
//}

const STORE_URL = process.env.GATSBY_STORE_URL || "http://localhost:9000"

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: 1,
    },
  },
})

export const wrapPageElement = ({ element }) => {
  return (
    <MedusaProvider
      baseUrl={STORE_URL}
      queryClientProviderProps={{
        client,
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
