import React from "react"
import { ThemeProvider as Provider } from "emotion-theming"

export const theme = {
  colors: {
    primary: "#B27979",
    secondary: "#79B28A",
    lightest: "#fefefe",
    light: "#f0f0f0",
    dark: "#454545",
    darkest: "#212121",
  },
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
