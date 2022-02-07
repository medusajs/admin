import { capitalize } from "lodash"
import React from "react"
import CancelIcon from "../../../../components/fundamentals/icons/cancel-icon"
import PackageIcon from "../../../../components/fundamentals/icons/package-icon"
import Actionables from "../../../../components/molecules/actionables"
import { TrackingLink } from "./tracking-link"

export const FormattedFulfillment = ({
  onCancelFulfillment,
  setFullfilmentToShip,
  order,
  fulfillmentObj,
}) => {
  const { fulfillment } = fulfillmentObj
  const hasLinks = !!fulfillment.tracking_links?.length

  const getData = () => {
    switch (true) {
      case fulfillment?.claim_order_id:
        return {
          resourceId: fulfillment.claim_order_id,
          resourceType: "claim",
        }
      case fulfillment?.swap_id:
        return {
          resourceId: fulfillment.swap_id,
          resourceType: "swap",
        }
      default:
        return { resourceId: order?.id, resourceType: "order" }
    }
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col space-y-1 py-2">
        <div className="text-grey-90">
          {fulfillment.canceled_at
            ? "Fulfillment has been canceled"
            : `${fulfillmentObj.title} Fulfilled by ${capitalize(
                fulfillment.provider_id
              )}`}
        </div>
        <div className="flex text-grey-50">
          {!fulfillment.shipped_at ? "Not shipped" : "Tracking"}
          {hasLinks &&
            fulfillment.tracking_links.map((tl, j) => (
              <TrackingLink key={j} trackingLink={tl} />
            ))}
        </div>
      </div>
      {!fulfillment.canceled_at && !fulfillment.shipped_at && (
        <div className="flex items-center space-x-2">
          <Actionables
            actions={[
              {
                label: "Mark Shipped",
                icon: <PackageIcon size={"20"} />,
                onClick: () => setFullfilmentToShip(fulfillment),
              },
              {
                label: "Cancel Fulfillment",
                icon: <CancelIcon size={"20"} />,
                onClick: () =>
                  onCancelFulfillment({
                    ...getData(),
                    fulId: fulfillment.id,
                  }),
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}
