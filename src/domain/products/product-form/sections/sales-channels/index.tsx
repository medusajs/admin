import React, { useEffect } from "react"
import { Product, SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels, useAdminStore } from "medusa-react"
import Badge from "../../../../../components/fundamentals/badge"
import Button from "../../../../../components/fundamentals/button"
import ChannelsIcon from "../../../../../components/fundamentals/icons/channels-icon"
import BodyCard from "../../../../../components/organisms/body-card"
import useToggleState from "../../../../../hooks/use-toggle-state"
import ProductAvailabilityModal from "./product-availability-modal"
import Spinner from "../../../../../components/atoms/spinner"
import { useProductForm } from "../../form/product-form-context"
import CrossIcon from "../../../../../components/fundamentals/icons/cross-icon"

type SalesChannelsProps = {
  isEdit?: boolean
  product: Product
}

type SalesChannelBadgeProps = {
  channel: SalesChannel
  onRemove: () => void
}

const SalesChannels: React.FC<SalesChannelsProps> = ({
  isEdit = false,
  product,
}) => {
  const {
    state: isScModalOpen,
    open: openScModal,
    close: closeScModal,
  } = useToggleState()

  const {
    salesChannels,
    setSalesChannels,
    additionalDirtyState,
  } = useProductForm()

  const { count, isLoading: isLoadingSalesChannels } = useAdminSalesChannels()
  const { store, isLoading: isLoadingStore } = useAdminStore()

  const isLoading = isLoadingSalesChannels || isLoadingStore

  useEffect(() => {
    if (
      !isEdit &&
      !isLoadingStore &&
      store?.default_sales_channel &&
      !additionalDirtyState.salesChannels
    ) {
      setSalesChannels([store.default_sales_channel], false)
    }
  }, [isLoadingStore, additionalDirtyState.salesChannels])

  const remainder = Math.max(salesChannels.length - 3, 0)
  return (
    <>
      <BodyCard
        title="Sales Channels"
        subtitle="This product will only be available in the default sales channel if left untouched."
        className="min-h-[200px]"
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex space-x-2">
              <div className="flex space-x-2 max-w-[600px] overflow-clip">
                {salesChannels?.slice(0, 3).map((sc, idx) => {
                  return (
                    <SalesChannelBadge
                      channel={sc}
                      onRemove={() => {
                        const newSalesChannels = [...salesChannels]
                        newSalesChannels.splice(idx, 1)
                        setSalesChannels(newSalesChannels)
                      }}
                    />
                  )
                })}
              </div>
              {remainder > 0 && (
                <Badge variant="ghost">
                  <div className="flex px-2 items-center h-full inter-base-regular text-grey-50">
                    + {remainder} more
                  </div>
                </Badge>
              )}
            </div>
            <span className="inter-base-regular text-grey-50 mb-large mt-base">
              Available in{" "}
              <span className="inter-base-semibold text-grey-90">
                {salesChannels?.length}
              </span>{" "}
              out of{" "}
              <span className="inter-base-semibold text-grey-90">{count}</span>{" "}
              Sales Channels
            </span>

            <div>
              <Button
                variant="ghost"
                size="small"
                className="border border-grey-20"
                onClick={openScModal}
              >
                <ChannelsIcon size={20} />
                Change availability
              </Button>
            </div>
          </>
        )}
      </BodyCard>
      {isScModalOpen && !isLoading && (
        <ProductAvailabilityModal
          storeSelectedSalesChannels={setSalesChannels}
          salesChannels={salesChannels}
          onClose={closeScModal}
        />
      )}
    </>
  )
}

const SalesChannelBadge: React.FC<SalesChannelBadgeProps> = ({
  channel,
  onRemove,
}) => {
  return (
    <Badge variant="ghost" className="">
      <div className="flex py-1.5 pl-2 pr-1 space-x-xsmall items-center">
        <span className="inter-base-regular text-grey-90">{channel.name}</span>
        <Button
          variant="ghost"
          className="h-5 w-5 p-0 text-grey-50"
          onClick={onRemove}
        >
          <CrossIcon size={16} />
        </Button>
      </div>
    </Badge>
  )
}

export default SalesChannels
