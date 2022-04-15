import React from "react"

import { CurrencyType } from "../../../utils/currencies"

type PriceInputProps = {
  amount: number
  currency: CurrencyType
  onChange: (amount: number) => void
}

/**
 * TODOs:
 *
 * 2. formatted input (comma separators)
 */

function PriceInput(props: PriceInputProps) {
  const { amount, currency, onChange } = props

  const { code, symbol } = currency

  const rightOffset = 24 + symbol.length * 4

  return (
    <div className="w-[314px] relative">
      <div className="absolute flex items-center h-full top-0 left-3">
        <span className="text-small text-grey-40 mt-[1px]">{code}</span>
      </div>

      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => {
          onChange(Number(e.target.value))
        }}
        style={{ paddingRight: rightOffset }}
        className="
        focus:bg-white focus:border-violet-6
        w-full h-[40px]
        py-[10px] pl-12
        text-gray-90
        bg-grey-5
        text-right
        text-small
        border border-solid border-grey-20
        rounded-lg
      "
      />

      <div className="absolute flex items-center h-full top-0 right-3">
        <span className="text-small text-grey-40 mt-[1px]">{symbol}</span>
      </div>
    </div>
  )
}

export default PriceInput
