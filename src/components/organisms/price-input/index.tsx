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
 * 1. variable currency symbol length
 * 2. formatted input (comma separators)
 */

function PriceInput(props: PriceInputProps) {
  const { amount, currency, onChange } = props

  const { code, symbol } = currency

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
  })

  return (
    <div className="w-[314px] relative">
      <div className="absolute flex items-center h-full top-0 left-3">
        <span className="text-small text-grey-40">{code}</span>
      </div>

      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => {
          onChange(Number(e.target.value))
        }}
        className="
        focus:bg-white focus:border-violet-6
        w-full h-[40px]
        py-[10px] pr-7 p-12
        text-gray-90
        bg-grey-5
        text-right
        text-small
        border border-solid border-grey-20
        rounded-lg
      "
      />

      <div className="absolute flex items-center h-full top-0 right-3">
        <span className="text-small text-grey-40">{symbol}</span>
      </div>
    </div>
  )
}

export default PriceInput
