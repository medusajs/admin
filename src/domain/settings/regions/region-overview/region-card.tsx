import { Region } from "@medusajs/medusa"
import React from "react"
import RadioGroup from "../../../../components/organisms/radio-group"
import fulfillmentProvidersMapper from "../../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../../utils/payment-providers-mapper"

type Props = {
  region: Region
}

const RegionCard = ({ region }: Props) => {
  return (
    <RadioGroup.Item
      value={region.id}
      label={region.name}
      sublabel={
        region.countries && region.countries.length
          ? region.countries.map((c) => c.display_name).join(", ")
          : undefined
      }
    >
      <div className="flex flex-col gap-y-2xsmall">
        <p>
          Payment providers:{" "}
          <span>
            {region.payment_providers?.length
              ? region.payment_providers
                  .map((pp) => paymentProvidersMapper(pp.id))
                  .join(", ")
              : "Not configured"}
          </span>
        </p>
        <p>
          Fulfillment providers:{" "}
          <span>
            {region.payment_providers?.length
              ? region.payment_providers
                  .map((fp) => fulfillmentProvidersMapper(fp.id))
                  .join(", ")
              : "Not configured"}
          </span>
        </p>
      </div>
    </RadioGroup.Item>
  )
}

export default RegionCard
