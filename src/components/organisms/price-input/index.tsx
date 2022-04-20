import React from "react"
import AmountField from "react-currency-input-field"
import { CurrencyInputProps } from "react-currency-input-field"

import { CurrencyType } from "../../../utils/currencies"

/**
 * `PriceInput` interface
 */
type PriceInputProps = {
  /* When consuming the component, we'll most likely be getting amount as numbers */
  amount: number
  currency: CurrencyType
  onAmountChange: (amount?: number) => void
}

/**
 * A controlled input component that renders the formatted amount
 * and the currency of the provided price.
 */
function PriceInput(props: PriceInputProps) {
  /* State used to keep track of the input value as a string */
  const [rawValue, setRawValue] = React.useState<string | undefined>(
    `${props.amount || 0}`
  )
  const { amount, currency, onAmountChange } = props
  const { code, symbol_native, decimal_digits } = currency

  // as we'll be receiving amount including the decimal digits, we'll need to display them accordingly
  // e.g: variant X has a price of 19.99 usd: server returns { amount: 1999 } which will need to be converted to 19.99

  React.useEffect(() => {
    const value = amount / 10 ** decimal_digits
    setRawValue(`${value}`)
  }, [amount])

  /** ******** COMPUTED **********/

  const step = 10 ** -decimal_digits
  const rightOffset = 24 + symbol_native.length * 4
  const placeholder = `0.${"0".repeat(decimal_digits)}`

  /** ******** HANDLERS **********/

  const onChange: CurrencyInputProps["onValueChange"] = (value) => {
    if (value) {
      const numericalValue = Math.round(
        parseFloat(value) * 10 ** decimal_digits
      )
      onAmountChange(numericalValue)
    } else {
      onAmountChange(0)
    }
    setRawValue(value)
  }

  return (
    <div className="w-[314px] relative">
      <div className="absolute flex items-center h-full top-0 left-3">
        <span className="text-small text-grey-40 mt-[1px]">{code}</span>
      </div>

      <AmountField
        step={step}
        value={rawValue}
        onValueChange={onChange}
        allowNegativeValue={false}
        placeholder={placeholder}
        decimalScale={decimal_digits}
        // Passing this prop makes the onChange handler run after an onBlur event..
        // ..which is not easy to handle when consuming the component..
        // ..because the expectation when passing an onChange handler would be to either get 5000 all the way through or 50.00..
        // ..(assuming decimal_digits == 2)
        // fixedDecimalLength={decimal_digits}
        style={{ paddingRight: rightOffset }}
        className="focus:bg-white focus:border-violet-6
            border border-solid border-grey-20
            w-full h-[40px]
            py-[10px] pl-12
            rounded-lg
            bg-grey-5
            text-gray-90
            text-right
            text-small"
      />

      <div className="absolute flex items-center h-full top-0 right-3">
        <span className="text-small text-grey-40 mt-[1px]">
          {symbol_native}
        </span>
      </div>
    </div>
  )
}

export default PriceInput
