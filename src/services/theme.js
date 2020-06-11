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
    inputShadow: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    `,
    inputShadowHover: `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(58, 151, 212, 0.36) 0px 0px 0px 4px, 
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    `,
  },
  forms: {
    largeInput: {
      border: 0,
      outline: 0,
      transition: "all 0.2s ease",
      borderRadius: "3px",
      boxShadow: "inputShadow",
      "&:focus": {
        boxShadow: "inputShadowHover",
      },
      "&::placeholder": {
        color: "placeholder",
      },
      cursor: "text",
    },
  },
  variants: {},
}

export const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
)
