import clsx from "clsx"
import React, { useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import InputError from "../../../../components/atoms/input-error"
import { currencies } from "../../../../utils/currencies"

type Props = {
  currencyCode: string
  amount?: number | null
  onChange: (amount?: number) => void
  errors?: { [x: string]: unknown }
  name?: string
}

const PriceFormInput = ({
  name,
  currencyCode,
  errors,
  amount,
  onChange,
}: Props) => {
  const { symbol_native, decimal_digits } = currencies[
    currencyCode.toUpperCase()
  ]

  const [rawValue, setRawValue] = useState<string | undefined>(
    amount ? `${amount}` : undefined
  )

  useEffect(() => {
    if (amount) {
      const value = amount / 10 ** decimal_digits
      setRawValue(`${value}`)
    }
  }, [amount, decimal_digits])

  const onAmountChange = (value) => {
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

  const step = 10 ** -decimal_digits

  return (
    <div>
      <div
        className={clsx(
          "w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded h-10 focus-within:shadow-input focus-within:border-violet-60",
          {
            "border-rose-50": errors && name && errors[name],
          }
        )}
      >
        <span className="inter-base-regular text-grey-40">{symbol_native}</span>

        <AmountField
          step={step}
          value={rawValue}
          onValueChange={onAmountChange}
          allowNegativeValue={false}
          placeholder="-"
          decimalScale={decimal_digits}
          className="bg-transparent outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40 text-right"
        />
      </div>
      <InputError name={name} errors={errors} />
    </div>
  )
}

export default PriceFormInput
