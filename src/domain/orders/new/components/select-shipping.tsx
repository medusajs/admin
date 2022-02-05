import React, { useContext, useEffect } from "react"
import Button from "../../../../components/fundamentals/button"
import AlertIcon from "../../../../components/fundamentals/icons/alert-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import { extractOptionPrice } from "../../../../utils/prices"

const SelectShippingMethod = ({
  shippingOptions,
  handleOptionSelect,
  shippingOption,
  showCustomPrice,
  setShowCustomPrice,
  setCustomOptionPrice,
  customOptionPrice,
  region,
}) => {
  const { disableNextPage, enableNextPage } = useContext(SteppedContext)

  useEffect(() => {
    if (!shippingOption) {
      disableNextPage()
    }
  }, [])

  return (
    <div className="min-h-[705px]">
      <span className="inter-base-semibold">
        Shipping method{" "}
        <span className="inter-base-regular text-grey-50">
          (To {region.name})
        </span>
      </span>

      {!shippingOptions?.length ? (
        <div className="inter-small-regular mt-6 p-4 text-orange-50 bg-orange-5 rounded-rounded flex text-grey-50">
          <div className="h-full mr-3">
            <AlertIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="inter-small-semibold">Attention!</span>
            You don't have any options for orders without shipping. Please add
            one (e.g. "In-store fulfillment") with "Show on website" unchecked
            in region settings and continue.
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <Select
            label="Choose a shipping method"
            onChange={(so) => {
              handleOptionSelect(so)
              enableNextPage()
            }}
            value={
              shippingOption
                ? {
                    value: shippingOption.id,
                    label: `${shippingOption.name} - ${extractOptionPrice(
                      shippingOption.amount,
                      region
                    )}`,
                  }
                : null
            } //
            options={
              shippingOptions?.map((so) => ({
                value: so.id,
                label: `${so.name} - ${extractOptionPrice(so.amount, region)}`,
              })) || []
            }
          />
          <div className="mt-4">
            {!showCustomPrice && (
              <div className="w-full flex justify-end">
                <Button
                  variant="ghost"
                  size="small"
                  className="w-[125px] border border-grey-20"
                  disabled={!shippingOption}
                  onClick={() => setShowCustomPrice(true)}
                >
                  Set custom price
                </Button>
              </div>
            )}
            {showCustomPrice && (
              <div className="flex items-center">
                <div className="w-full">
                  <CurrencyInput
                    readOnly
                    size="small"
                    currentCurrency={region.currency_code}
                  >
                    <CurrencyInput.AmountInput
                      label="Custom Price"
                      value={customOptionPrice}
                      onChange={(value) => setCustomOptionPrice(value)}
                    />
                  </CurrencyInput>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowCustomPrice(false)}
                  className="ml-8 text-grey-40 w-8 h-8"
                >
                  <TrashIcon size={20} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectShippingMethod
