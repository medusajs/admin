import { LineItem, ReservationItemDTO } from "@medusajs/medusa"
import { sum } from "lodash"
import { useAdminStockLocations } from "medusa-react"
import React, { useContext } from "react"
import Tooltip from "../../../../components/atoms/tooltip"
import Button from "../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon"
import CircleQuaterSolid from "../../../../components/fundamentals/icons/circle-quater-solid"
import ExclamationCircleIcon from "../../../../components/fundamentals/icons/exclamation-circle-icon"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { FeatureFlagContext } from "../../../../context/feature-flag"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import EditAllocationDrawer from "../allocations/edit-allocation-modal"

type OrderLineProps = {
  item: LineItem
  currencyCode: string
  reservation?: ReservationItemDTO[]
}

const OrderLine = ({ item, currencyCode, reservation }: OrderLineProps) => {
  const { isFeatureEnabled } = useContext(FeatureFlagContext)
  return (
    <div className="mx-[-5px] mb-1 flex h-[64px] justify-between rounded-rounded py-2 px-[5px] hover:bg-grey-5">
      <div className="flex justify-center space-x-4">
        <div className="flex h-[48px] w-[36px] overflow-hidden rounded-rounded">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[185px] flex-col justify-center">
          <span className="inter-small-regular truncate text-grey-90">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular truncate text-grey-50">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex  items-center">
        <div className="mr-3 flex small:space-x-2 medium:space-x-4 large:space-x-6">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: (item?.total ?? 0) / item.quantity,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
          <div className="inter-small-regular text-grey-50">
            x {item.quantity}
          </div>
          {isFeatureEnabled("inventoryService") && (
            <ReservationIndicator reservations={reservation} lineItem={item} />
          )}
          <div className="inter-small-regular text-grey-90">
            {formatAmountWithSymbol({
              amount: item.total ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

const ReservationIndicator = ({
  reservations,
  lineItem,
}: {
  reservations?: ReservationItemDTO[]
  lineItem: LineItem
}) => {
  const { stock_locations } = useAdminStockLocations({
    id: reservations?.map((r) => r.location_id) || [],
  })

  const [reservation, setReservation] =
    React.useState<ReservationItemDTO | null>(null)

  const locationMap = new Map(stock_locations?.map((l) => [l.id, l.name]) || [])

  const reservationsSum = sum(reservations?.map((r) => r.quantity) || [])
  const awaitingAllocation = lineItem.quantity - reservationsSum

  return (
    <div className={awaitingAllocation ? "text-rose-50" : "text-grey-40"}>
      <Tooltip
        content={
          <div className="inter-small-regular flex flex-col items-center px-1 pb-2 pt-1">
            <div className="grid grid-cols-1 gap-y-base divide-y">
              {!!awaitingAllocation && (
                <span className="flex w-full items-center">
                  {awaitingAllocation} items await allocation
                </span>
              )}
              {reservations?.map((reservation) => (
                <EditAllocationButton
                  locationName={locationMap.get(reservation.location_id)}
                  totalReservedQuantity={reservationsSum}
                  reservation={reservation}
                  lineItem={lineItem}
                  onClick={() => setReservation(reservation)}
                />
              ))}
            </div>
          </div>
        }
        side="bottom"
      >
        {awaitingAllocation ? (
          reservationsSum ? (
            <CircleQuaterSolid size={20} />
          ) : (
            <ExclamationCircleIcon size={20} />
          )
        ) : (
          <CheckCircleFillIcon size={20} />
        )}
      </Tooltip>

      {reservation && (
        <EditAllocationDrawer
          totalReservedQuantity={reservationsSum}
          close={() => setReservation(null)}
          reservation={reservation}
          item={lineItem}
        />
      )}
    </div>
  )
}

const EditAllocationButton = ({
  reservation,
  locationName,
  onClick,
}: {
  reservation: ReservationItemDTO
  totalReservedQuantity: number
  locationName?: string
  lineItem: LineItem
  onClick: () => void
}) => {
  return (
    <div className="pt-base first:pt-0">
      {`${reservation.quantity} item: ${locationName}`}
      <Button
        onClick={onClick}
        variant="ghost"
        size="small"
        className="mt-2 w-full border"
      >
        Edit Allocation
      </Button>
    </div>
  )
}

export default OrderLine
