import { useAdminShippingOptions } from "medusa-react"
import React from "react"
import Section from "../../../../../components/organisms/section"
import ShippingOptionCard from "../../components/shipping-option-card"

type Props = {
  regionId: string
}

const ReturnShippingOptions = ({ regionId }: Props) => {
  const { shipping_options: returnShippingOptions } = useAdminShippingOptions({
    region_id: regionId,
    is_return: true,
  })

  return (
    <Section title="Return Shipping Options">
      <div className="flex flex-col gap-y-large">
        <p className="inter-base-regular text-grey-50">
          Enter specifics about available regional return shipment methods.
        </p>
        <div className="flex flex-col gap-y-small">
          {returnShippingOptions?.map((option) => {
            return <ShippingOptionCard option={option} key={option.id} />
          })}
        </div>
      </div>
    </Section>
  )
}

export default ReturnShippingOptions
