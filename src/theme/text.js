export default {
  h1: {
    fontSize: "32px",
    fontWeight: "bold",
    lineHeight: "39px",
  },
  h2: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  h3: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  link: {
    color: "link",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    ":hover": {
      color: "medusa-100",
    },
  },
  body: {
    default: {
      fontWeight: "normal",
      fontSize: "16px",
    },
    heavy: {
      variant: "text.body.default",
      fontWeight: 500,
    },
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: 300,
  },
  subtitle2: {
    fontSize: "20px",
    fontWeight: 300,
  },
  subtitle3: {
    fontSize: "18px",
    fontWeight: 300,
  },
  small: {
    default: {
      fontSize: "14px",
      fontWeight: "normal",
    },
    heavy: {
      variant: "text.small.default",
      fontWeight: 500,
    },
    bold: {
      variant: "text.small.default",
      fontWeight: 700,
    },
  },
  tiny: {
    default: {
      fontSize: "12px",
      fontWeight: "normal",
    },
    heavy: {
      variant: "text.tiny.default",
      fontWeight: 500,
    },
  },
}
