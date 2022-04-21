import React, { FocusEventHandler } from "react"
import AmountField from "react-currency-input-field"
import { CurrencyInputProps } from "react-currency-input-field"

import { CurrencyType } from "../../../utils/currencies"
import clsx from "clsx"

/**
 * `PriceInput` interface
 */
type PriceInputProps = {
  amount: string
  currency: CurrencyType
  hasVirtualFocus?: boolean
  onAmountChange: (amount?: string) => void

  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
}

/**
 * A controlled input component that renders the formatted amount
 * and the currency of the provided price.
 */
function PriceInput(props: PriceInputProps) {
  const { amount, currency, hasVirtualFocus, onAmountChange } = props
  const { code, symbol_native, decimal_digits } = currency

  /********** COMPUTED **********/

  const step = 10 ** -decimal_digits
  const rightOffset = 24 + symbol_native.length * 4
  const placeholder = `0.${"0".repeat(decimal_digits)}`

  /********** HANDLERS **********/

  const onChange: CurrencyInputProps["onValueChange"] = (value) => {
    onAmountChange(value)
  }

  return (
    <div className="w-[314px] relative">
      <div className="absolute flex items-center h-full top-0 left-3">
        <span className="text-small text-grey-40 mt-[1px]">{code}</span>
      </div>

      <AmountField
        step={step}
        value={amount}
        onValueChange={onChange}
        allowNegativeValue={false}
        placeholder={placeholder}
        decimalScale={decimal_digits}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        // fixedDecimalLength={decimal_digits}
        style={{ paddingRight: rightOffset }}
        className={clsx(
          `focus:bg-white focus:border-violet-60
            border border-solid 
            w-full h-[40px]
            py-[10px] pl-12
            rounded-lg
            bg-grey-5
            text-gray-90
            text-right
            text-small`,
          {
            "bg-white border-violet-60": hasVirtualFocus,
            "border-grey-20": !hasVirtualFocus,
          }
        )}
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
