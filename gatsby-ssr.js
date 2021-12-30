import React from "react"
import "./src/assets/styles/global.css"
import { ThemeProvider as Provider } from "./src/theme"

export const wrapPageElement = ({ element }) => {
  return <Provider>{element}</Provider>
}
