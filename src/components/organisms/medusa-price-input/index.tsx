import * as React from "react"
import { CurrencyType } from "../../../utils/currencies"
import PriceInput, { PriceInputProps } from "../price-input"

type MedusaPriceInputProps = {
  amount: number
  currency: CurrencyType
  onChange: (amount?: number) => void
}

/**
 * A controlled input component that wraps around PriceInput and renders the amount
 * and the currency of the provided price coming from a medusa server.
 */
function MedusaPriceInput(props: MedusaPriceInputProps) {
  const [rawValue, setRawValue] = React.useState<string | undefined>(
    `${props.amount || 0}`
  )
  const { amount, currency, onChange } = props
  const { decimal_digits } = currency

  React.useEffect(() => {
    const value = amount / 10 ** decimal_digits
    setRawValue(`${value}`)
  }, [amount, decimal_digits])

  /** ******** HANDLERS **********/

  const onAmountChange: PriceInputProps["onAmountChange"] = (value) => {
    if (value) {
      const numericalValue = Math.round(
        parseFloat(value) * 10 ** decimal_digits
      )
      onChange(numericalValue)
    } else {
      onChange(0)
    }
    setRawValue(value)
  }

  return (
    <PriceInput
      amount={rawValue}
      onAmountChange={onAmountChange}
      currency={currency}
    />
  )
}

export default MedusaPriceInput
