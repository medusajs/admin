import { Inventory } from "@medusajs/medusa"
import clsx from "clsx"
import { Link } from "gatsby"
import * as React from "react"
import { getInventoryStatusVariant } from "../../../utils/inventory-status-variant"
import Button from "../../fundamentals/button"
import ListIcon from "../../fundamentals/icons/list-icon"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import Actionables from "../../molecules/actionables"
import useInventoryActions from "./use-inventory-actions"

type InventoryOverviewProps = {
  inventory?: Inventory[]
  toggleListView: () => void
}

const InventoryOverview = ({
  inventory,
  toggleListView,
}: InventoryOverviewProps) => {
  return (
    <>
      <div className="flex justify-end border-t border-b border-grey-20 py-2.5 pr-xlarge">
        <div className="inter-small-semibold text-grey-50 flex justify-self-end">
          <span
            onClick={toggleListView}
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-40"
            )}
          >
            <ListIcon size={20} />
          </span>
          <span
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-90"
            )}
          >
            <TileIcon size={20} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6">
        {inventory.map((inventory) => (
          <InventoryTile inventory={inventory} />
        ))}
      </div>
    </>
  )
}

const InventoryTile = ({ inventory }) => {
  const { getActions } = useInventoryActions(inventory)

  return (
    <div className="p-base group rounded-rounded hover:bg-grey-5 flex-col">
      <div className="relative">
        <div
          className={clsx("rounded-base inline-block absolute top-2 right-2")}
        >
          <Actionables
            actions={getActions()}
            customTrigger={
              <Button
                variant="ghost"
                size="small"
                className="w-xlarge h-xlarge hidden-actions group-hover:opacity-100 focus-within:opacity-100 opacity-0 bg-grey-0"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
        <Link to={`${inventory.id}`}>
          {inventory.thumbnail ? (
            <img
              className="min-h-[230px] block object-cover rounded-rounded"
              src={inventory.thumbnail}
            />
          ) : (
            <div className="min-h-[230px] flex items-center justify-center bg-grey-5 rounded-rounded">
              <ImagePlaceholder />
            </div>
          )}
          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular text-grey-90 line-clamp-1 mr-3">
                {inventory.title}
              </p>
              <StatusIndicator
                variant={getInventoryStatusVariant(inventory.status)}
                className="shrink-0"
              />
            </div>
            <span className="inter-small-regular text-grey-50 line-clamp-1">
              {inventory.collection?.title}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default InventoryOverview
