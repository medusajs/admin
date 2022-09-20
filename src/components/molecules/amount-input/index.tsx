import React, { useEffect, useRef, useState } from "react"
import { Option } from "../../../types/shared"
import { currencies } from "../../../utils/currencies"
import InputError from "../../atoms/input-error"
import InputHeader from "../../fundamentals/input-header"
import { NextSelect } from "../select/next-select"

type Amount = number | null | undefined

type AmountAndCurrency = {
  amount: Amount
  currency: Option | null | undefined
}

type Value<T extends boolean> = T extends true ? Amount : AmountAndCurrency

type OnAmountChange<T extends boolean> = (value: Value<T>) => void

type Props<T extends boolean> = {
  label?: string
  errors?: Record<string, unknown>
  name?: string
  readOnlyCurrency: T
  onChange: OnAmountChange<T>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  value: Value<T>
}

const AmountInput = <T extends boolean = true>({
  label,
  errors,
  name,
  readOnlyCurrency,
  onChange,
  onBlur,
}: Props<T>) => {
  const [menuWidth, setMenuWidth] = useState(0)

  const [localAmount, setLocalAmount] = React.useState<
    number | undefined | null
  >(undefined)

  const [localCurrency, setLocalCurrency] = React.useState<
    Option | undefined | null
  >(undefined)

  const handleCurrencyChange = (value?: Option | null) => {
    setLocalCurrency(value)
    onChange({ amount: localAmount, currency: value } as Value<T>)
  }

  const innerRef = useRef<HTMLInputElement>(null)

  useEffect(
    () => setMenuWidth(innerRef.current?.getBoundingClientRect().width || 0),
    [innerRef]
  )

  return (
    <div className="flex flex-col gap-y-xsmall w-full">
      {label && <InputHeader label={label} />}
      <div
        className="grid grid-cols-[88px_1fr] bg-grey-5 rounded-rounded border border-grey-20"
        ref={innerRef}
      >
        {readOnlyCurrency ? (
          <span>USD</span>
        ) : (
          <div className="border-r border-grey-20">
            <NextSelect
              customStyles={{
                control: "border-none",
              }}
              placeholder="USD"
              options={Object.values(currencies).map((c) => ({
                value: c.code,
                label: c.code,
              }))}
              isMulti={false}
              onBlur={onBlur}
              value={localCurrency}
              onChange={(value) => handleCurrencyChange(value)}
            />
          </div>
        )}
        <input type="number" className="bg-transparent" onBlur={onBlur} />
      </div>
      <InputError errors={errors} name={name} />
    </div>
  )
}

export default AmountInput
