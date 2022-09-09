import { ValidationRule } from "react-hook-form"
import { normalizeAmount } from "./prices"

const FormValidator = {
  whiteSpaceRule: (name: string) =>
    ({
      value: /^[^\s]+(?:$|.*[^\s]+$)/,
      message: `${name} cannot have leading or trailing spaces, or be an empty string.`,
    } as ValidationRule<RegExp>),
  nonNegativeNumberRule: (name: string) => ({
    value: 0,
    message: `${name} cannot be negative.`,
  }),
  minOneCharRule: (name: string) => ({
    value: 1,
    message: `${name} must be at least 1 character.`,
  }),
  min: (name: string, min: number) => ({
    value: min,
    message: `${name} must be greater than or equal to ${min}.`,
  }),
  max: (name: string, max: number) => ({
    value: max,
    message: `${name} must be less than or equal to ${max}.`,
  }),
  required: (name: string) => ({
    value: true,
    message: `${name} is required.`,
  }),
  minLength: (name: string, min: number) => ({
    value: min,
    message: `${name} must be at least ${min} characters.`,
  }),
  maxInteger: (name: string, currency?: string) => {
    const max = 2147483647
    const normalizedAmount = currency ? normalizeAmount(currency, max) : max

    return {
      value: max,
      message: `${name} must be less than or equal to ${normalizedAmount.toLocaleString()}.`,
    }
  },
  validateMaxInteger: (name: string, amount: number, currency?: string) => {
    const max = 2147483647
    const normalizedAmount = currency ? normalizeAmount(currency, max) : max

    return (
      amount <= max ||
      `${name} must be less than or equal to ${normalizedAmount.toLocaleString()}.`
    )
  },
}

export default FormValidator
