import React from "react"
import { ToastProvider } from "react-toast-notifications"
import "./src/assets/styles/global.css"
import { AccountProvider } from "./src/context/account"
import { CacheProvider } from "./src/context/cache"
import { InterfaceProvider } from "./src/context/interface"
import { ThemeProvider as Provider } from "./src/theme"

//export const shouldUpdateScroll = ({ routerProps: { location } }) => {
//  window.scrollTo(0, 0)
//  return false
//}

export const wrapPageElement = ({ element }) => {
  return (
    <CacheProvider>
      <AccountProvider>
        <InterfaceProvider>
          <ToastProvider autoDismiss={true} placement="bottom-left">
            <Provider>{element}</Provider>
          </ToastProvider>
        </InterfaceProvider>
      </AccountProvider>
    </CacheProvider>
  )
}
