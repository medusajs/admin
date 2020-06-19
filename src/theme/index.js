import React from "react"
import breakpoints from "./breakpoints"
import spacing from "./spacing"
import forms from "./forms"
import { ThemeProvider as Provider } from "emotion-theming"

export const theme = {
  colors: {
    primary: "#B27979",
    secondary: "#79B28A",
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
  shadows: {
    inputBoxShadow: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    `,
    inputBoxShadowHover: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    `,
    buttonBoxShadow: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
    `,
    buttonBoxShadowHover: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
    `,
    buttonBoxShadowActive: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 3px 9px 0px;
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
    `,
  },
  variants: {
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
    primary: {
      color: "dark",
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

    secondary: {
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
  },
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
