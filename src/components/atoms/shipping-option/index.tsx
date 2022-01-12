import React from "react"

type RequirementType = {
  type: string
  amount: number
}

type ShippingOptionProps = {
  name: string
  price_type: string
  amount: number
  currency_code: string
  data: {
    name?: string
  }
  requirements?: RequirementType[]
  editFn:
}

const ShippingOption: React.FC<ShippingOptionProps> = ({
  name,
  price_type,
  amount,
  currency_code,
  data,
  requirements,
  editFn
}) => {
  return (
    <div>
      <div>
        <p>
          {name} {data.name && `(${data.name})`}
        </p>
        <button>Edit</button>
      </div>
    </div>
  )
}

export default ShippingOption
