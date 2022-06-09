import { Option } from "../types/shared"

export default function (provider: string): Option {
  switch (provider) {
    case "stripe":
      return {
        label: "Stripe",
        value: "stripe",
      }
    case "stripe-ideal":
      return {
        label: "Stripe Ideal",
        value: "stripe-ideal",
      }
    case "stripe-giropay":
      return {
        label: "Stripe Giropay",
        value: "stripe-giropay",
      }
    case "stripe-bancontact":
      return {
        label: "Stripe Bancontact",
        value: "stripe-bancontact",
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
    case "manual": {
      return {
        label: "Manual",
        value: "manual",
      }
    }
    default:
      return {
        label: provider,
        value: provider,
      }
  }
}
