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
    placeholder: "#a3acb9",
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

  forms: {
    input: {
      color: "dark",
      backgroundColor: "lightest",

      border: 0,
      outline: 0,

      cursor: "text",
      transition: "all 0.2s ease",

      borderRadius: "3px",
      boxShadow: "inputBoxShadow",
      "&:focus": {
        boxShadow: "inputBoxShadowHover",
      },
      "&::placeholder": {
        color: "placeholder",
      },
    },
  },

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
