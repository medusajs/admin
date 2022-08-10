import React from "react"
import { formatAmountWithSymbol } from "../../../../utils/prices"

const OrderLine = ({ item, currencyCode }) => {
  return (
    <div className="flex justify-between mb-1 h-[64px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
      <div className="flex space-x-4 justify-center">
        <div className="flex h-[48px] w-[36px]">
          <img src={item.thumbnail} className="rounded-rounded object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="inter-small-regular text-grey-90 max-w-[225px] truncate">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular text-grey-50">
              {item.variant.sku}
            </span>
          )}
        </div>
      </div>
      <div className="flex  items-center">
        <div className="flex small:space-x-2 medium:space-x-4 large:space-x-6 mr-3">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: item.unit_price,
              currency: currencyCode,
              digits: 2,
              tax: item.tax_lines,
            })}
          </div>
          <div className="inter-small-regular text-grey-50">
            x {item.quantity}
          </div>
          <div className="inter-small-regular text-grey-90">
            {formatAmountWithSymbol({
              amount: item.unit_price * item.quantity,
              currency: currencyCode,
              digits: 2,
              tax: item.tax_lines,
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">{currencyCode}</div>
      </div>
    </div>
  )
}

export default OrderLine
