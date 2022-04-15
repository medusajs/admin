import React, { useState } from "react"

import { CurrencyType } from "../../../utils/currencies"

type PriceInputProps = {
  amount: number
  currency: CurrencyType
  onChange: (amount: number) => void
}

function PriceInput(props: PriceInputProps) {
  const { currency } = props
  const [amount, setAmount] = useState(0)

  const [isDirty, setIsDirty] = useState(false)
  const { code, symbol, decimal_digits } = currency

  const step = 10 ** -decimal_digits
  const placeholder = `0.${"0".repeat(decimal_digits)}`
  const rightOffset = 24 + symbol.length * 4

  console.log({ amount })

  const value = isDirty
    ? amount
    : amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })

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
        type={"number"}
        placeholder={placeholder}
        onFocus={() => setIsDirty(true)}
        onBlur={() => setIsDirty(false)}
        onChange={(e) => {
          setAmount(Number(e.target.value))
        }}
        value={value}
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
