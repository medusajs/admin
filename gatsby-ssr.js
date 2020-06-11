import React from "react"
import { ThemeProvider as Provider } from "./src/services/theme"

export const wrapPageElement = ({ element }) => {
  return <Provider>{element}</Provider>
}
