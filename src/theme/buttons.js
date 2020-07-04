export const buttons = {
  primary: {
    height: "30px",
    color: "dark",
    backgroundColor: "lightest",

    border: 0,
    outline: 0,

    paddingTop: "3px",
    paddingBottom: "3px",

    cursor: "pointer",

    borderRadius: "3px",
    boxShadow: "buttonPrimaryBoxShadow",

    "&:hover": {
      color: "darkest",
      boxShadow: "buttonPrimaryBoxShadowHover",
    },

    "&:active": {
      boxShadow: "buttonPrimaryBoxShadowActive",
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
    transition: "all 1s ease",

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
    fontSize: "22px",

    border: 0,
    outline: 0,

    paddingTop: "3px",
    paddingBottom: "3px",

    cursor: "pointer",

    borderRadius: "3px",
    boxShadow: "buttonPrimaryBoxShadow",

    "&:hover": {
      color: "darkest",
      boxShadow: "buttonPrimaryBoxShadowHover",
    },

    "&:active": {
      boxShadow: "buttonPrimaryBoxShadowActive",
    },
  },
}
