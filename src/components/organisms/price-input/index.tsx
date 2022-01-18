import React, { useEffect, useRef, useState } from "react"
import CurrencyInputField from "react-currency-input-field"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import CurrencyInput from "../../molecules/currency-input"

type PriceInputProps = {
  currencyCodes?: string[]
  currentCurrency?: string
  currentAmount?: number
  amountRequired?: boolean
  currencyRequired?: boolean
  step?: number
  onAmountChange: (amount: number | undefined) => void
  onCurrencyChange: (currencyCode: string | undefined) => void
}

const PriceInput: React.FC<PriceInputProps> = ({
  currencyCodes,
  currentCurrency,
  currentAmount,
  amountRequired = false,
  currencyRequired = false,
  step = 1,
  onAmountChange,
  onCurrencyChange,
}) => {
  const [amount, setAmount] = useState<number | undefined>(currentAmount)
  const [symbol, setSymbol] = useState<string | undefined>(currentCurrency)
  const inputRef = useRef<HTMLInputElement>(null)

  const onClickChevronUp = () => {
    setAmount(amount ? amount + step : step)
    inputRef.current?.dispatchEvent(
      new InputEvent("change", {
        view: window,
        bubbles: true,
        cancelable: false,
      })
    )
  }

  const onClickChevronDown = () => {
    if (amount && amount > 0) {
      setAmount(amount - step)
    }
    inputRef.current?.dispatchEvent(
      new InputEvent("change", {
        view: window,
        bubbles: true,
        cancelable: false,
      })
    )
  }

  const handleAmountChange = (value) => {
    setAmount(value)
  }

  const handleCurrencyChange = (currency) => {
    setSymbol(currency?.symbol)
    onCurrencyChange(currency?.value)
  }

  useEffect(() => {
    onAmountChange(amount)
  }, [amount])

  return (
    <div className="flex items-center gap-x-2xsmall">
      <CurrencyInput
        options={currencyCodes}
        currentCurrency={currentCurrency}
        required={currencyRequired}
        onCurrencyChange={handleCurrencyChange}
        className="w-[142px]"
      />
      <InputContainer onClick={() => inputRef.current?.focus()}>
        <InputHeader label="Amount" required={amountRequired} />
        <div className="flex items-center mt-2xsmall">
          {symbol && (
            <span className="inter-base-regular text-grey-40 mr-xsmall">
              {symbol}
            </span>
          )}
          <CurrencyInputField
            decimalsLimit={2}
            className="bg-inherit outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40"
            ref={inputRef}
            step={1}
            allowNegativeValue={false}
            value={amount}
            onValueChange={handleAmountChange}
          />
          <div className="flex self-end">
            <span
              onClick={onClickChevronDown}
              onMouseDown={(e) => e.preventDefault()}
              className="mr-2 text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
            >
              <MinusIcon size={16} />
            </span>
            <span
              onMouseDown={(e) => e.preventDefault()}
              onClick={onClickChevronUp}
              className="text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
            >
              <PlusIcon size={16} />
            </span>
          </div>
        </div>
      </InputContainer>
    </div>
  )
}

export default PriceInput
