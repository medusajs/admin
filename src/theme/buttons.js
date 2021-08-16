export const buttons = {
  link: {
    cursor: "pointer",
    color: "link",
    fill: "link",
    fontSize: 0,
    "&:hover": {
      color: "medusa",
      fill: "medusa",
    },
  },
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
      boxShadow: "pillActiveFocus",
    },
  },
  danger: {
    minHeight: "28px",
    fontWeight: "500",
    color: "light",
    fontSize: "14px",
    lineHeight: "14px",
    backgroundColor: "danger",
    border: 0,
    outline: 0,
    paddingTop: "3px",
    paddingBottom: "3px",
    cursor: "pointer",
    borderRadius: "3px",
    boxShadow: "buttonBoxShadow",
    "&:hover": {
      boxShadow: "buttonBoxShadowHover",
    },
    "&:active": {
      boxShadow: "buttonBoxShadowActive",
    },
  },
  primary: {
    minHeight: "24px",
    height: "30px",
    fontWeight: "500",
    color: "dark",
    fontSize: "14px",
    lineHeight: "14px",
    backgroundColor: "lightest",
    border: 0,
    outline: 0,
    paddingTop: "3px",
    paddingBottom: "3px",
    cursor: "pointer",
    borderRadius: "5px",
    boxShadow: "buttonBoxShadow",
    "&:hover": {
      color: "darkest",
      boxShadow: "buttonBoxShadowHover",
    },
    "&:active": {
      boxShadow: "buttonBoxShadowActive",
    },
    "&:disabled": {
      cursor: "not-allowed",
      pointerEvents: "none",
      opacity: 0.5,
    },
  },
  "deep-blue": {
    minHeight: "24px",
    height: "30px",
    fontWeight: "500",
    color: "lightest",
    fontSize: "14px",
    lineHeight: "14px",
    backgroundColor: "#0A3149",
    border: 0,
    outline: 0,
    paddingTop: "3px",
    paddingBottom: "3px",
    cursor: "pointer",
    borderRadius: "5px",
    boxShadow: "buttonBoxShadow",
    "&:hover": {
      color: "lightest",
      backgroundColor: "#00263E",
      boxShadow: "buttonBoxShadowHover",
    },
    "&:active": {
      boxShadow: "buttonBoxShadowActive",
    },
    "&:disabled": {
      cursor: "not-allowed",
      pointerEvents: "none",
      opacity: 0.5,
    },
  },
  green: {
    minHeight: "24px",
    height: "28px",
    color: "lightest",
    fontSize: "14px",
    lineHeight: "14px",
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
    borderRadius: "5px",
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
    fontSize: "14px",
    lineHeight: "14px",

    border: 0,
    outline: 0,

    paddingTop: "3px",
    paddingBottom: "3px",

    cursor: "pointer",

    borderRadius: "5px",
    boxShadow: "ctaBoxShadow",

    "&:hover": {
      boxShadow: "ctaBoxShadowHover",
    },

    "&:disabled": {
      cursor: "not-allowed",
      pointerEvents: "none",
      opacity: 0.5,
    },
  },
  delete: {
    height: "30px",
    color: "white",
    backgroundColor: "#b02b13",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "14px",

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
}

export default buttons
