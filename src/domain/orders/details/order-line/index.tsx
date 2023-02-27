import { LineItem } from "@medusajs/medusa"
import React from "react"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type OrderLineProps = {
  item: LineItem
  currencyCode: string
}

const OrderLine = ({ item, currencyCode }: OrderLineProps) => {
  return (
    <div className="mx-[-5px] mb-1 flex h-[64px] justify-between rounded-rounded py-2 px-[5px] hover:bg-grey-5">
      <div className="flex justify-center space-x-4">
        <div className="flex h-[48px] w-[36px] overflow-hidden rounded-rounded">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[185px] flex-col justify-center">
          <span className="inter-small-regular truncate text-grey-90">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular truncate text-grey-50">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex  items-center">
        <div className="mr-3 flex small:space-x-2 medium:space-x-4 large:space-x-6">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: (item?.total ?? 0) / item.quantity,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
          <div className="inter-small-regular text-grey-50">
            x {item.quantity}
          </div>
          <div className="inter-small-regular text-grey-90">
            {formatAmountWithSymbol({
              amount: item.total ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default OrderLine
