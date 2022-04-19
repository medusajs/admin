import React, { useState } from "react"

import { CurrencyType } from "../../../utils/currencies"

type PriceInputProps = {
  amount: number
  currency: CurrencyType
  onChange: (amount: number) => void
}

function PriceInput(props: PriceInputProps) {
  const { currency } = props
  const { code, symbol, decimal_digits } = currency

  const [amount, setAmount] = useState<number>()
  const [isDirty, setIsDirty] = useState(false)

  const step = 10 ** -decimal_digits
  const rightOffset = 24 + symbol.length * 4
  const placeholder = `0.${"0".repeat(decimal_digits)}`

  const value = isDirty
    ? amount
    : amount?.toLocaleString("en-US", {
        minimumFractionDigits: decimal_digits,
        maximumFractionDigits: decimal_digits,
      })

  const onFocus = () => setIsDirty(true)
  const onBlur = () => setIsDirty(false)

  const onChange = (e) => {
    if (e.target.value === "") setAmount(undefined)
    else {
      const a = Number(Number(e.target.value).toFixed(decimal_digits))
      setAmount(a)
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
        type={isDirty ? "number" : "text"}
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        value={value}
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
        <span className="text-small text-grey-40 mt-[1px]">{symbol}</span>
      </div>
    </div>
  )
}

export default PriceInput
