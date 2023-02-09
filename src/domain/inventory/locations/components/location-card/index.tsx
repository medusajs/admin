import React from "react"
import { StockLocationDTO } from "@medusajs/medusa"
import IconBadge from "../../../../../components/fundamentals/icon-badge"
import BuildingsIcon from "../../../../../components/fundamentals/icons/buildings-icon"
import { countryLookup } from "../../../../../utils/countries"
import Actionables, {
  ActionType,
} from "../../../../../components/molecules/actionables"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import useToggleState from "../../../../../hooks/use-toggle-state"
import LocationEditModal from "../../edit"
import SalesChannelsSection from "../sales-channels-section"
import useImperativeDialog from "../../../../../hooks/use-imperative-dialog"
import { useAdminDeleteStockLocation } from "medusa-react"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { useFeatureFlag } from "../../../../../context/feature-flag"

type Props = {
  location: StockLocationDTO
}

const LocationCard: React.FC<Props> = ({ location }) => {
  const { mutate: deleteLocation } = useAdminDeleteStockLocation(location.id)

  const dialog = useImperativeDialog()
  const notification = useNotification()
  const { isFeatureEnabled } = useFeatureFlag()

  const {
    state: editLocationState,
    close: closeLocationEdit,
    open: openLocationEdit,
  } = useToggleState()

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Location",
      text: "Are you sure you want to delete this location",
      extraConfirmation: true,
      entityName: location.name,
    })
    if (shouldDelete) {
      deleteLocation(undefined, {
        onSuccess: () => {
          notification("Success", "Location deleted successfully", "success")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const DropdownActions: ActionType[] = [
    {
      label: "Edit details",
      onClick: openLocationEdit,
      variant: "normal",
      icon: <EditIcon size="20px" />,
    },
    {
      label: "Delete",
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size="20px" />,
    },
  ]

  return (
    <div className="border my-base rounded-rounded bg-grey-0 border-grey-20">
      <div className="flex items-center px-6 py-base">
        <IconBadge>
          <BuildingsIcon />
        </IconBadge>
        <div className="flex flex-col ml-base">
          <span className="font-semibold text-grey-90">{location.name}</span>
          {location.address && (
            <div>
              {location.address.city && <span>{location.address.city}, </span>}
              <span>{countryLookup(location.address.country_code)}</span>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <Actionables actions={DropdownActions} forceDropdown={true} />
        </div>
      </div>
      {isFeatureEnabled("sales_channels") && (
        <div className="px-6 border-t border-solid py-base border-grey-20">
          <h2 className="text-gray-500 inter-small-semibold">
            Connected sales channels
          </h2>
          <SalesChannelsSection location={location} />
        </div>
      )}
      {editLocationState && (
        <LocationEditModal onClose={closeLocationEdit} location={location} />
      )}
    </div>
  )
}

export default LocationCard
