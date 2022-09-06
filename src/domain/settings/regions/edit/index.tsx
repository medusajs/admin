import { useAdminRegion } from "medusa-react"
import React from "react"
import GeneralSection from "./general-section"
import ReturnShippingOptions from "./return-shipping-options"
import ShippingOptions from "./shipping-options"

type Props = {
  id?: string
}

const EditRegion = ({ id }: Props) => {
  const { region, isLoading } = useAdminRegion(id!, {
    enabled: !!id,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!region) {
    return <div>Region not found</div>
  }

  return (
    <div className="flex flex-col gap-y-xsmall">
      <GeneralSection region={region} />
      <ShippingOptions regionId={region.id} />
      <ReturnShippingOptions regionId={region.id} />
    </div>
  )
}

export default EditRegion
