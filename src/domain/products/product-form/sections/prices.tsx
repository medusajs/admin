import * as React from "react"
import { Controller } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import BodyCard from "../../../../components/organisms/body-card"
import CurrencyInput from "../../../../components/organisms/currency-input"
import { useProductForm } from "../form/product-form-context"
import usePricesFieldArray from "../form/use-prices-field-array"

const Prices = ({ currencyCodes, defaultCurrencyCode, defaultAmount }) => {
  const { control } = useProductForm()
  const {
    fields,
    appendPrice,
    deletePrice,
    availableCurrencies,
  } = usePricesFieldArray(
    currencyCodes,
    {
      control,
      name: "prices",
      keyName: "indexId",
    },
    {
      defaultAmount,
      defaultCurrencyCode,
    }
  )

  return (
    <BodyCard
      title="Pricing"
      subtitle="Give products a price for each of the currencies that you sell in"
      className="min-h-0"
    >
      <div className="mt-base">
        <h6 className="inter-base-semibold text-grey-90 mr-1.5">Prices</h6>

        <div className="max-w-[630px]">
          {fields.map((field, index) => {
            return (
              <div
                key={field.indexId}
                className="last:mb-0 mb-xsmall flex items-center"
              >
                <div className="flex-1">
                  <Controller
                    control={control}
                    key={field.indexId}
                    name={`prices.${index}.price`}
                    defaultValue={field.price}
                    render={({ field: { onChange, value } }) => {
                      const codes = [
                        value?.currency_code,
                        ...availableCurrencies,
                      ]
                      codes.sort()
                      return (
                        <CurrencyInput.Root
                          currencyCodes={codes}
                          currentCurrency={value?.currency_code}
                          size="medium"
                          readOnly={index === 0}
                          onChange={(code) =>
                            onChange({ ...value, currency_code: code })
                          }
                        >
                          <CurrencyInput.Amount
                            label="Amount"
                            onChange={(amount) =>
                              onChange({ ...value, amount })
                            }
                            amount={value?.amount}
                          />
                        </CurrencyInput.Root>
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
