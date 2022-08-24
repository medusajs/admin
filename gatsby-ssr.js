import { MedusaProvider } from "medusa-react"
import React from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastProvider } from "react-toast-notifications"
import "./src/assets/styles/global.css"
import { AccountProvider } from "./src/context/account"
import { CacheProvider } from "./src/context/cache"
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
          <InterfaceProvider>
            <ToastProvider autoDismiss={true} placement="bottom-left">
              <DndProvider context={HTML5Backend}>{element}</DndProvider>
            </ToastProvider>
          </InterfaceProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}
