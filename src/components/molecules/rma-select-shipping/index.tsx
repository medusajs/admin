import React from "react"
import Button from "../../fundamentals/button"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import CurrencyInput from "../../organisms/currency-input"

type RMAShippingPriceProps = {
  inclTax: boolean
  useCustomShippingPrice: boolean
  shippingPrice: number | undefined
  currencyCode: string
  updateShippingPrice: (price: number | undefined) => void
  setUseCustomShippingPrice: (useCustomShippingPrice: boolean) => void
}

const RMAShippingPrice: React.FC<RMAShippingPriceProps> = ({
  useCustomShippingPrice,
  inclTax,
  shippingPrice,
  currencyCode,
  updateShippingPrice,
  setUseCustomShippingPrice,
}) => {
  return useCustomShippingPrice ? (
    <div className="flex items-center mt-4">
      <CurrencyInput
        readOnly
        size="small"
        currentCurrency={currencyCode}
        className="w-full"
      >
        <CurrencyInput.AmountInput
          label={`Amount (${inclTax ? "incl." : "excl."} tax)`}
          amount={shippingPrice}
          onChange={updateShippingPrice}
        />
      </CurrencyInput>
      <Button
        onClick={() => setUseCustomShippingPrice(false)}
        className="w-8 h-8 ml-8 text-grey-40"
        variant="ghost"
        size="small"
      >
        <TrashIcon size={20} />
      </Button>
    </div>
  ) : (
    <div className="flex w-full mt-4 justify-end">
      <Button
        onClick={() => setUseCustomShippingPrice(true)}
        variant="ghost"
        className="border border-grey-20"
        size="small"
      >
        Add custom price
      </Button>
    </div>
  )
}

export default RMAShippingPrice
