import { ValidationRule } from "react-hook-form"

const FormValidator = {
  whiteSpaceRule: (name: string) =>
    ({
      value: /^[^\s]+(?:$|.*[^\s]+$)/,
      message: `${name} cannot have leading or trailing spaces, or be an empty string.`,
    } as ValidationRule<RegExp>),
    nonNegativeNumberRule: (name: string) => ({
      value: 0,
      message: `${name} cannot be negative.`,
    })
}

export default FormValidator
