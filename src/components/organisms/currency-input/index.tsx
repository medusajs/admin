import clsx from "clsx"
import React, { useContext, useEffect, useRef, useState } from "react"
import AmountField from "react-currency-input-field"
import { Option } from "../../../types/shared"
import { currencies, CurrencyType } from "../../../utils/currencies"
import { getDecimalDigits, normalizeAmount } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import Input from "../../molecules/input"
import Select from "../../molecules/select"

type CurrencyInputProps = {
  currencyCodes?: string[]
  currentCurrency?: string
  size?: "small" | "medium" | "full"
  readOnly?: boolean
  onChange?: (currencyCode: string) => void
  className?: React.HTMLAttributes<HTMLDivElement>["className"]
}

type CurrencyInputState = {
  currencyInfo: CurrencyType | undefined
}

type AmountInputProps = {
  label: string
  amount: number | undefined
  required?: boolean
  step?: number
  allowNegative?: boolean
  onChange?: (amount: number | undefined) => void
  onValidate?: (amount: number | undefined) => boolean
  invalidMessage?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const CurrencyContext = React.createContext<CurrencyInputState>({
  currencyInfo: undefined,
})

const getCurrencyInfo = (currencyCode?: string) => {
  if (!currencyCode) {
    return undefined
  }
  const currencyInfo = currencies[currencyCode.toUpperCase()]
  return currencyInfo
}

const CurrencyInput: React.FC<CurrencyInputProps> & {
  AmountInput: React.FC<AmountInputProps>
} = ({
  currentCurrency,
  currencyCodes,
  size = "full",
  readOnly = false,
  onChange,
  children,
  className,
}) => {
  const options: Option[] =
    currencyCodes?.map((code) => ({
      label: code.toUpperCase(),
      value: code,
    })) ?? []

  const [selectedCurrency, setSelectedCurrency] = useState<
    CurrencyType | undefined
  >(getCurrencyInfo(currentCurrency))

  const [value, setValue] = useState<Option | null>(
    currentCurrency
      ? {
          label: currentCurrency.toUpperCase(),
          value: currentCurrency,
        }
      : null
  )

  useEffect(() => {
    if (currentCurrency) {
      setSelectedCurrency(getCurrencyInfo(currentCurrency))
      setValue({
        label: currentCurrency.toUpperCase(),
        value: currentCurrency,
      })
    }
  }, [currentCurrency])

  const onCurrencyChange = (currency: Option) => {
    // Should not be nescessary, but the component we use for select input
    // has a bug where it passes a null object if you click on the label
    // of the already selected value
    if (!currency) {
      return
    }

    setValue(currency)
    setSelectedCurrency(getCurrencyInfo(currency.value))

    if (onChange) {
      onChange(currency.value)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currencyInfo: selectedCurrency,
      }}
    >
      <div className={clsx("flex items-center gap-x-2xsmall", className)}>
        <div
          className={clsx(
            { "w-[144px]": size === "medium" },
            { "w-[120px]": size === "small" },
            { "w-full": size === "full" }
          )}
        >
          {!readOnly ? (
            <Select
              enableSearch
              label="Currency"
              value={value}
              onChange={onCurrencyChange}
              options={options}
              disabled={readOnly}
            />
          ) : (
            <Input
              label="Currency"
              value={value?.label}
              readOnly
              className="pointer-events-none"
              tabIndex={-1}
            />
          )}
        </div>
        {children && <div className="w-full">{children}</div>}
      </div>
    </CurrencyContext.Provider>
  )
}

const AmountInput: React.FC<AmountInputProps> = ({
  label,
  required = false,
  amount,
  step = 1,
  allowNegative = false,
  onChange,
  onValidate,
  invalidMessage,
  ...rest
}) => {
  const { currencyInfo } = useContext(CurrencyContext)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [value, setValue] = useState<string | undefined>(
    amount ? `${normalizeAmount(currencyInfo?.code, amount)}` : undefined
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.dispatchEvent(new Event("blur"))
  }, [currencyInfo?.decimal_digits])

  useEffect(() => {
    if (currencyInfo && amount) {
      setValue(`${normalizeAmount(currencyInfo?.code, amount)}`)
    }
  }, [amount])

  const handleChange = (value) => {
    let persistedAmount: number | undefined = undefined

    if (!value) {
      value = 0
    }

    if (currencyInfo) {
      const amount = parseFloat(value)
      const multiplier = getDecimalDigits(currencyInfo.code)
      persistedAmount = multiplier * amount
    }

    if (onChange && typeof persistedAmount !== "undefined") {
      const updateAmount = Math.round(persistedAmount)
      let update = true
      if (onValidate) {
        update = onValidate(updateAmount)
      }

      if (update) {
        onChange(updateAmount)
        setValue(`${value}`)
        setInvalid(false)
      } else {
        setInvalid(true)
      }
    }
  }

  const handleManualValueChange = (val: number) => {
    const newValue = parseFloat(value ?? "0") + val

    if (!allowNegative && newValue < 0) {
      return
    }

    handleChange(`${newValue}`)
  }

  return (
    <InputContainer onClick={() => inputRef.current?.focus()} {...rest}>
      <InputHeader label={label} required={required} />
      <div className="flex items-center mt-2xsmall">
        {currencyInfo?.symbol_native && (
          <Tooltip
            open={invalid}
            side={"top"}
            content={invalidMessage || "Amount is not valid"}
          >
            <span className="inter-base-regular text-grey-40 mr-xsmall">
              {currencyInfo.symbol_native}
            </span>
          </Tooltip>
        )}
        <AmountField
          className="bg-inherit outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40"
          decimalScale={currencyInfo?.decimal_digits}
          value={value}
          onValueChange={handleChange}
          ref={inputRef}
          step={step}
          allowNegativeValue={allowNegative}
          placeholder="0.00"
        />
        <div className="flex self-end">
          <button
            className="mr-2 text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
            type="button"
            onClick={() => handleManualValueChange(-step)}
          >
            <MinusIcon size={16} />
          </button>
          <button
            type="button"
            className="text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
            onClick={() => handleManualValueChange(step)}
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>
    </InputContainer>
  )
}

CurrencyInput.AmountInput = AmountInput

export default CurrencyInput
