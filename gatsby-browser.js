import React from "react"
import { AccountProvider } from "./src/context/account"
import { ThemeProvider as Provider } from "./src/theme"

export const wrapPageElement = ({ element }) => {
  return (
    <AccountProvider>
      <Provider>{element}</Provider>
    </AccountProvider>
  )
}
