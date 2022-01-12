import type { ShippingOption as ShippingOptionType } from "@medusajs/medusa"
import { ShippingOptionPriceType } from "@medusajs/medusa/dist/models/shipping-option"
import { RequirementType } from "@medusajs/medusa/dist/models/shipping-option-requirement"
import React from "react"

type ShippingOptionProps = {
  option: ShippingOptionType
  currency_code: string
  editFn: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
}

const ShippingOption: React.FC<ShippingOptionProps> = ({
  option,
  currency_code,
  editFn,
}) => {
  return (
    <div>
      <div>
        <p>
          {option.name} {option.data.name && `(${option.data.name})`}
        </p>
        <p>
          {option.price_type === ShippingOptionPriceType.FLAT_RATE
            ? "Flat Rate"
            : "Calculated"}
          :{" "}
          {option.amount !== undefined &&
            `${option.amount / 100} ${currency_code.toUpperCase()}`}
          {option.requirements.length &&
            option.requirements.map(r => {
              const type =
                r.type === RequirementType.MAX_SUBTOTAL
                  ? "Max. subtotal"
                  : "Min. subtotal"
              return `- ${type}: ${
                r.amount / 100
              } ${currency_code.toUpperCase()}`
            })}
        </p>
      </div>
      <div>
        <button onClick={editFn}>Edit</button>
      </div>
    </div>
  )
}

export default ShippingOption
