import React from "react"
import breakpoints from "./breakpoints"
import buttons from "./buttons"
import spacing from "./spacing"
import shadows from "./shadows"
import forms from "./forms"
import { ThemeProvider as Provider } from "emotion-theming"

import "../fonts/index.css"

export const theme = {
  colors: {
    link: "#5469D3",
    primary: "#3b77ff",
    secondary: "#79B28A",
    medusaGreen: "#454B54",
    medusa: "#454B54",
    inactive: "#89959C",
    danger: "#FF7675",
    muted: "#E3E8EE",
    gray: "#a3acb9",
    lightest: "#fefefe",
    light: "#f0f0f0",
    dark: "#454545",
    darkest: "#212121",
    placeholder: "#a3acb9",
    blue: "#5469d4",
  },
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
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
