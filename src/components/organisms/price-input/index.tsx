import React, { useState } from "react"

import { CurrencyType } from "../../../utils/currencies"

/**
 * `PriceInput` interface
 */
type PriceInputProps = {
  amount: number
  currency: CurrencyType
  onAmountChange: (amount?: number) => void
}

/**
 * A controlled input component that renders the formatted amount
 * and the currency of the provided price.
 */
function PriceInput(props: PriceInputProps) {
  const { amount, currency, onAmountChange } = props
  const { code, symbol_native, decimal_digits } = currency

  const [isDirty, setIsDirty] = useState(false)

  /********** COMPUTED **********/

  const step = 10 ** -decimal_digits
  const rightOffset = 24 + symbol_native.length * 4
  const placeholder = `0.${"0".repeat(decimal_digits)}`

  const value = isDirty
    ? amount
    : amount?.toLocaleString("en-US", {
        minimumFractionDigits: decimal_digits,
        maximumFractionDigits: decimal_digits,
      })

  /********** HANDLERS **********/

  const onFocus = () => setIsDirty(true)

  const onBlur = () => setIsDirty(false)

  const onChange = (e) => {
    // empty or invalid! input case
    if (e.target.value === "") onAmountChange(undefined)
    else {
      const a = Number(Number(e.target.value).toFixed(decimal_digits))
      onAmountChange(a)
    }
  }

  return (
    <div className="w-[314px] relative">
      <div className="absolute flex items-center h-full top-0 left-3">
        <span className="text-small text-grey-40 mt-[1px]">{code}</span>
      </div>

      <input
        min="0"
        lang="en"
        step={step}
        inputMode="decimal"
        placeholder={placeholder}
        type={isDirty ? "number" : "text"}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        style={{ paddingRight: rightOffset }}
        className="
            focus:bg-white focus:border-violet-6
            border border-solid border-grey-20
            w-full h-[40px]
            py-[10px] pl-12
            rounded-lg
            bg-grey-5
            text-gray-90
            text-right
            text-small
          "
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
