import React from "react"
import { Option } from "../../../types/shared"
import { currencies } from "../../../utils/currencies"
import InputError from "../../atoms/input-error"
import InputHeader from "../../fundamentals/input-header"
import { NextSelect } from "../select/next-select"

type Value = {
  amount: number | null | undefined
  currency: Option | null | undefined
}

type Props = {
  label?: string
  errors?: Record<string, unknown>
  name?: string
  onChange: (value: Value) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  value: Value
}

const AmountInput = <T extends boolean = true>({
  label,
  errors,
  name,
  value,
  onChange,
  onBlur,
}: Props) => {
  const [localAmount, setLocalAmount] = React.useState<
    number | undefined | null
  >(value.amount)

  const [localCurrency, setLocalCurrency] = React.useState<
    Option | undefined | null
  >(value.currency)

  const handleCurrencyChange = (value?: Option | null) => {
    setLocalCurrency(value)
    onChange({ amount: localAmount, currency: value })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber
    setLocalAmount(value)
    onChange({ amount: value, currency: localCurrency })
  }

  return (
    <div className="flex flex-col gap-y-xsmall w-full">
      {label && <InputHeader label={label} />}
      <div className="focus-within:shadow-focus-border rounded-rounded">
        <div className="relative bg-grey-5 rounded-rounded h-10 shadow-border focus-within:shadow-cta transition-colors">
          <NextSelect
            customStyles={{
              control:
                "border-none absolute inset-0 bg-transparent focus-within:shadow-none !shadow-none focus-within:border-none pl-0",
              inner_control: "!max-w-[88px] border-r border-grey-20 pl-base",
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
          <div className="absolute left-[88px] inset-y-0 right-0 grid grid-cols-[1fr_16px] pl-xsmall pr-base gap-2xsmall inter-base-regular h-10">
            <input
              type="number"
              className="bg-transparent text-right w-full focus:outline-none"
              onBlur={onBlur}
              onChange={handleAmountChange}
              value={localAmount || undefined}
            />
            <div className="flex items-center justify-end">
              <p className="text-grey-40">$</p>
            </div>
          </div>
        </div>
      </div>
      <InputError errors={errors} name={name} />
    </div>
  )
}

export default AmountInput
