import { LineItem } from "@medusajs/medusa"

import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import React from "react"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import Actionables from "../../../../components/molecules/actionables"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import DuplicateIcon from "../../../../components/fundamentals/icons/duplicate-icon"
import RefreshIcon from "../../../../components/fundamentals/icons/refresh-icon"

type OrderEditLineProps = {
  item: LineItem
  currencyCode: string
  isNew?: boolean
  quantity: number
  onQuantityChange: (itemId: string, quantity: number) => void
}

const OrderEditLine = ({
  quantity,
  item,
  currencyCode,
  onQuantityChange,
}: OrderEditLineProps) => {
  return (
    <div className="flex justify-between mb-1 h-[64px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
      <div className="flex space-x-4 justify-center flex-grow-1">
        <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-center max-w-[185px]">
          <span className="inter-small-regular text-grey-90 truncate">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular text-grey-50 truncate">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-9">
        <div className="flex items-center flex-grow-0 text-gray-500">
          <MinusIcon
            className="cursor-pointer"
            onClick={() =>
              quantity > 1 && onQuantityChange(item.id, quantity - 1)
            }
          />
          <span className="px-8 text-center text-gray-900">{quantity}</span>
          <PlusIcon
            className="cursor-pointer text-gray-40"
            onClick={() => onQuantityChange(item.id, quantity + 1)}
          />
        </div>

        <div className="flex small:space-x-2 medium:space-x-4 large:space-x-6 ">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: item.unit_price * quantity,
              currency: currencyCode,
              tax: item.tax_lines,
              digits: 2,
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
        <Actionables
          forceDropdown
          actions={[
            {
              label: "Replace wit other item",
              onClick: () => console.log("TODO"),
              icon: <RefreshIcon size="20" />,
            },
            {
              label: "Duplicate item",
              onClick: () => console.log("TODO"),
              icon: <DuplicateIcon size="20" />,
            },
            {
              label: "Remove item",
              onClick: () => console.log("TODO"),
              variant: "danger",
              icon: <TrashIcon size="20" />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default OrderEditLine
