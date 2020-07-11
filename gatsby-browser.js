import React from "react"
import { AccountProvider } from "./src/context/account"
import { ThemeProvider as Provider } from "./src/theme"
import { ToastProvider } from "react-toast-notifications"

export const wrapPageElement = ({ element }) => {
  return (
    <AccountProvider>
      <ToastProvider autoDismiss={true}>
        <Provider>{element}</Provider>
      </ToastProvider>
    </AccountProvider>
  )
}
