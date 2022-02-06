import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import BodyCard from "../../../../components/organisms/body-card"
import CurrencyInput from "../../../../components/organisms/currency-input"
import { useProductForm } from "../form/product-form-context"

const Prices = ({ currencyCodes, defaultCurrencyCode, defaultAmount }) => {
  const { register, control, watch } = useProductForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
    keyName: "indexId",
  })
  const watchedFields = watch("prices", fields)
  const selectedCurrencies = watchedFields.map(
    (field) => field.price.currency_code
  )
  const availableCurrencies = currencyCodes?.filter(
    (currency) => !selectedCurrencies.includes(currency)
  )

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchedFields[index],
    }
  })

  const appendPrice = () => {
    let newCurrency = availableCurrencies[0]
    if (!selectedCurrencies.includes(defaultCurrencyCode)) {
      newCurrency = defaultCurrencyCode
    }
    append({
      price: { currency_code: newCurrency, amount: defaultAmount },
    })
  }

  const deletePrice = (index) => {
    return () => {
      remove(index)
    }
  }
  return (
    <BodyCard
      title="Pricing"
      subtitle="To start selling, all you need is a name, price, and image"
    >
      <div className="mt-base">
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">Prices</h6>
          <InfoTooltip
            content={
              "Give products a price for each of the currencies that you sell in."
            }
          />
        </div>
        <div className="max-w-[630px]">
          {controlledFields.map((field, index) => {
            return (
              <div
                key={field.indexId}
                className="last:mb-0 mb-xsmall flex items-center"
              >
                <div className="flex-1">
                  <Controller
                    control={control}
                    key={field.indexId}
                    name={`prices[${index}].price`}
                    ref={register()}
                    defaultValue={field.price}
                    render={({ onChange, value }) => {
                      return (
                        <CurrencyInput
                          currencyCodes={currencyCodes}
                          currentCurrency={value?.currency_code}
                          size="medium"
                          readOnly={index === 0}
                          onChange={(code) =>
                            onChange({ ...value, currency_code: code })
                          }
                        >
                          <CurrencyInput.AmountInput
                            label="Amount"
                            onChange={(amount) =>
                              onChange({ ...value, amount })
                            }
                            amount={value?.amount}
                          />
                        </CurrencyInput>
                      )
                    }}
                  />
                </div>
                {index !== 0 ? (
                  <button className="ml-large">
                    <TrashIcon
                      onClick={deletePrice(index)}
                      className="text-grey-40"
                      size="20"
                    />
                  </button>
                ) : null}
              </div>
            )
          })}
          <div className="mt-large mb-small">
            <Button
              onClick={appendPrice}
              type="button"
              variant="ghost"
              size="small"
              disabled={availableCurrencies?.length === 0}
            >
              <PlusIcon size={20} />
              Add a price
            </Button>
          </div>
        </div>
      </div>
    </BodyCard>
  )
}

export default Prices
