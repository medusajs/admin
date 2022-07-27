import { Address } from "@medusajs/medusa"
import React from "react"

type FormattedAddressProps = {
  title: string
  addr?: Address
}

export const FormattedAddress = ({ title, addr }: FormattedAddressProps) => {
  if (!addr) {
    return (
      <div className="flex flex-col pl-6">
        <div className="inter-small-regular text-grey-50 mb-1">{title}</div>
        <div className="flex flex-col inter-small-regular">N/A</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pl-6">
      <div className="inter-small-regular text-grey-50 mb-1">{title}</div>
      <div className="flex flex-col inter-small-regular">
        <span>
          {addr?.address_1} {addr?.address_2}
        </span>
        <span>
          {addr?.postal_code} {addr?.city}
          {", "}
          {addr?.province ? `${addr.province} ` : ""}
          {addr?.country_code?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
