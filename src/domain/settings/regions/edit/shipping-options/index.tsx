import { useAdminShippingOptions } from "medusa-react"
import React from "react"
import Section from "../../../../../components/organisms/section"
import ShippingOptionCard from "../../components/shipping-option-card"

type Props = {
  regionId: string
}

const ShippingOptions = ({ regionId }: Props) => {
  const { shipping_options: shippingOptions } = useAdminShippingOptions({
    region_id: regionId,
    is_return: false,
  })

  return (
    <Section title="Shipping Options">
      <div className="flex flex-col gap-y-large">
        <p className="inter-base-regular text-grey-50">
          Enter specifics about available regional shipment methods.
        </p>
        <div className="flex flex-col gap-y-small">
          {shippingOptions?.map((option) => {
            return <ShippingOptionCard option={option} key={option.id} />
          })}
        </div>
      </div>
    </Section>
  )
}

export default ShippingOptions
