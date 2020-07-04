import React from "react"
import breakpoints from "./breakpoints"
import spacing from "./spacing"
import shadows from "./shadows"
import forms from "./forms"
import { ThemeProvider as Provider } from "emotion-theming"

export const theme = {
  colors: {
    primary: "#B27979",
    secondary: "#79B28A",
    medusaGreen: "#3ecf8e",
    lightest: "#fefefe",
    light: "#f0f0f0",
    dark: "#454545",
    darkest: "#212121",
    placeholder: "#a3acb9",
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
  buttons: {
    pillActive: {
      cursor: "pointer",
      backgroundColor: "transparent",
      color: "dark",
      height: "40px",
      outline: 0,
      borderRadius: "3px",
      paddingTop: "3px",
      paddingBottom: "3px",
      boxShadow: "pillActive",
      "&:focus": {
        boxShadow: "pillActiveFocus",
      },
    },
    pill: {
      cursor: "pointer",
      backgroundColor: "transparent",
      color: "dark",
      height: "40px",
      outline: 0,
      borderRadius: "3px",
      paddingTop: "3px",
      paddingBottom: "3px",
      boxShadow: "pill",
      "&:focus": {
        boxShadow: "buttonBoxShadowActive",
      },
    },
    primary: {
      height: "30px",
      color: "dark",
      fontSize: "16px",
      backgroundColor: "lightest",
      border: 0,
      outline: 0,
      paddingTop: "3px",
      paddingBottom: "3px",
      cursor: "pointer",
      borderRadius: "3px",
      boxShadow: "buttonBoxShadow",
      "&:hover": {
        color: "darkest",
        boxShadow: "buttonBoxShadowHover",
      },
      "&:active": {
        boxShadow: "buttonBoxShadowActive",
      },
    },
    green: {
      height: "30px",
      color: "lightest",
      backgroundColor: "#53725D",
      border: 0,
      outline: 0,
      paddingTop: "3px",
      paddingBottom: "3px",
      cursor: "pointer",
      borderRadius: "3px",
      "&:focus": {
        boxShadow: "buttonBoxShadowFocus",
      },
      "&:active": {
        boxShadow: "buttonBoxShadowActive",
      },
    },
    secondary: {
      height: "30px",
      color: "light",
      backgroundColor: "dark",
      border: 0,
      outline: 0,
      paddingTop: "3px",
      paddingBottom: "3px",
      cursor: "pointer",
      borderRadius: "3px",
      "&:focus": {
        boxShadow: "buttonBoxShadowFocus",
      },
      "&:active": {
        boxShadow: "buttonBoxShadowActive",
      },
    },
    cta: {
      height: "30px",
      color: "white",
      backgroundColor: "medusaGreen",
      fontWeight: 600,
      fontSize: "16px",

      border: 0,
      outline: 0,

      paddingTop: "3px",
      paddingBottom: "3px",

      cursor: "pointer",

      borderRadius: "3px",
      boxShadow: "ctaBoxShadow",

      "&:hover": {
        boxShadow: "ctaBoxShadowHover",
      },
    },
  },
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
