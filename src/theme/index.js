import React from "react"
import breakpoints from "./breakpoints"
import buttons from "./buttons"
import spacing from "./spacing"
import shadows from "./shadows"
import forms from "./forms"
import text from "./text"
import colors from "./colors"
import { ThemeProvider as Provider } from "emotion-theming"

import "../fonts/index.css"

export const theme = {
  colors,
  borders: {
    hairline: "1px solid #E3E8EE",
  },
  fontSizes: [12, 14, 16, 18, 22],
  fonts: {
    body:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif",
    heading: "system-ui, sans-serif",
    monospace: "Menlo, monospace",
  },
  breakpoints,
  spacing,
  mediaQueries: {
    small: `@media screen and (min-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
  },
  grid: {
    selectedShadow: `
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      inset rgba(206, 208, 190, 0.56) 0px 0px 0px 2px,
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      inset rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    `,
    header: {
      padding: 2,
      fontSize: 1,
      fontFamily: "body",
    },
    data: {
      padding: 2,
      fontSize: 1,
      fontFamily: "body",
    },
  },
  shadows,
  variants: {
    loginCard: {
      boxShadow: "buttonBoxShadow",
      borderRadius: "3px",
    },
    badge: {
      fontSize: "0",
      color: "dark",
      backgroundColor: "lightest",
      boxShadow: "buttonBoxShadow",
      borderRadius: "3px",
      minWidth: "unset",
      px: "1",
    },
  },
  forms,
  buttons,
  text,
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
