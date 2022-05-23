import { Region, ShippingOption as Option } from "@medusajs/medusa"
import { useAdminShippingOptions } from "medusa-react"
import React, { useState } from "react"
import Spinner from "../../../components/atoms/spinner"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Actionables from "../../../components/molecules/actionables"
import ShippingOption from "../../../components/molecules/shipping-option"
import EditShipping from "./edit-shipping"
import NewShipping from "./new-shipping"

type ShippingProps = {
  region: Region
}

const Shipping: React.FC<ShippingProps> = ({ region }) => {
  const [editOption, setEditOption] = useState<Option | null>(null)
  const [showAddOption, setAddOption] = useState(false)
  const [showAddReturnOption, setAddReturnOption] = useState(false)

  const {
    shipping_options,
    isLoading: loadingOptions,
    refetch,
  } = useAdminShippingOptions({ region_id: region.id })

  const outboundOptions = [
    {
      icon: <PlusIcon />,
      label: "Add Option",
      onClick: () => setAddOption(true),
    },
  ]

  const inboundDropdownOptions = [
    {
      icon: <PlusIcon />,
      label: "Add Return",
      onClick: () => setAddReturnOption(true),
    },
  ]

  const outbound: Option[] = []
  const inbound: Option[] = []
  if (shipping_options) {
    for (const o of shipping_options) {
      if (o.is_return) {
        inbound.push(o)
      } else {
        outbound.push(o)
      }
    }
  }

  return (
    <>
      <div className="mb-2xlarge">
        <div className="flex items-center justify-between mb-base">
          <h2 className="inter-base-semibold">Shipping Options</h2>
          <Actionables actions={outboundOptions} />
        </div>
        <div className="flex flex-col">
          {!shipping_options ? (
            <div className="flex items-center justify-center h-screen">
              <div className="m-auto">
                <Spinner variant="secondary" />
              </div>
            </div>
          ) : (
            shipping_options
              .filter((o) => o.is_return === false && o.region_id === region.id)
              .map((option) => {
                return (
                  <div key={option.id} className="mb-xsmall last:mb-0">
                    <ShippingOption
                      option={option}
                      currency_code={region.currency_code}
                      onEdit={() => setEditOption(option)}
                    />
                  </div>
                )
              })
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-base">
          <h2 className="inter-base-semibold">Return Shipping Options</h2>
          <Actionables actions={inboundDropdownOptions} />
        </div>
        <div className="flex flex-col">
          {loadingOptions ? (
            <div className="flex items-center justify-center h-screen">
              <div className="m-auto">
                <Spinner variant="secondary" />
              </div>
            </div>
          ) : shipping_options ? (
            shipping_options
              .filter((o) => o.is_return && o.region_id === region.id)
              .map((option) => {
                return (
                  <div key={option.id} className="mb-xsmall last:mb-0">
                    <ShippingOption
                      option={option}
                      currency_code={region.currency_code}
                      onEdit={() => setEditOption(option)}
                    />
                  </div>
                )
              })
          ) : null}
        </div>
      </div>
      {editOption && (
        <EditShipping
          shippingOption={editOption}
          onClick={() => setEditOption(null)}
          onDone={refetch}
          region={region}
        />
      )}
      {(showAddOption || showAddReturnOption) && (
        <NewShipping
          isReturn={showAddReturnOption}
          onClick={() =>
            showAddReturnOption
              ? setAddReturnOption(false)
              : setAddOption(false)
          }
          onCreated={refetch}
          region={region}
        />
      )}
    </>
  )
}

export default Shipping
