import React from "react"

enum RequirementType {
  MAX_SUBTOTAL = "max_subtotal",
  MIN_SUBTOTAL = "min_subtotal",
}

type OptionType = {
  name: string
  price_type: "flat_rate" | "calculated"
  data: {
    name?: string
  }
  amount: number
  admin_only: boolean
  requirements: {
    type: RequirementType
    amount: number
  }[]
}

type ShippingOptionProps = {
  option: OptionType
  currency_code: string
  editFn: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
}

const ShippingOption: React.FC<ShippingOptionProps> = ({
  option,
  currency_code,
  editFn,
}) => {
  return (
    <div className="flex items-baseline justify-between p-base rounded-base border border-grey-20">
      <div>
        <p className="inter-small-semibold truncate">
          {option.name} {option.data.name && `(${option.data.name})`}{" "}
          {option.admin_only && (
            <span className="text-grey-50 inter-small-regular">
              (Not on website)
            </span>
          )}
        </p>
        <p className="inter-small-regular text-grey-50 truncate">
          {option.price_type === "flat_rate" ? "Flat Rate" : "Calculated"}:{" "}
          {option.amount !== undefined &&
            `${option.amount / 100} ${currency_code.toUpperCase()}`}
          {option.requirements.length
            ? option.requirements.map(r => {
                const type =
                  r.type === "max_subtotal" ? "Max. subtotal" : "Min. subtotal"
                return ` - ${type}: ${
                  r.amount / 100
                } ${currency_code.toUpperCase()}`
              })
            : null}
        </p>
      </div>
      <div>
        <button
          onClick={editFn}
          className="inter-small-semibold text-violet-60"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export default ShippingOption
