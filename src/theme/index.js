import React from "react"
import { ThemeProvider as Provider } from "emotion-theming"

import shadows from "./shadows"
import colors from "./colors"
import buttons from "./buttons"
import forms from "./forms"

export const theme = {
  colors,
  shadows,
  forms,
  buttons,
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
