export default function (provider) {
  switch (provider) {
    case "stripe":
      return {
        label: "Stripe",
        value: "stripe",
      }
    case "mobilepay-adyen":
      return {
        label: "MobilePay via Adyen",
        value: "mobilepay-adyen",
      }
    case "scheme-adyen":
      return {
        label: "Cards via Adyen",
        value: "scheme-adyen",
      }
    case "klarna-adyen":
      return {
        label: "Klarna via Adyen",
        value: "klarna-adyen",
      }
    case "klarna":
      return {
        label: "Klarna",
        value: "klarna",
      }
    case "paywithgoogle-adyen":
      return {
        label: "GooglePay via Adyen",
        value: "paywithgoogle-adyen",
      }
    case "applepay-adyen":
      return {
        label: "ApplePay via Adyen",
        value: "applepay-adyen",
      }
    case "paypal-adyen":
      return {
        label: "PayPal via Adyen",
        value: "paypal-adyen",
      }
    case "ideal-adyen":
      return {
        label: "iDEAL via Adyen",
        value: "ideal-adyen",
      }
    default:
      return {
        label: provider,
        value: provider,
      }
  }
}
