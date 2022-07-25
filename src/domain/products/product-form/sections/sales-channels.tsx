import React, { useEffect } from "react"
import { Product, SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels, useAdminStore } from "medusa-react"
import Badge from "../../../../components/fundamentals/badge"
import Button from "../../../../components/fundamentals/button"
import ChannelsIcon from "../../../../components/fundamentals/icons/channels-icon"
import BodyCard from "../../../../components/organisms/body-card"
import useToggleState from "../../../../hooks/use-toggle-state"
import ProductAvailabilityModal from "../../../../components/templates/product-availability-modal"
import Spinner from "../../../../components/atoms/spinner"
import { useProductForm } from "../form/product-form-context"

type SalesChannelsProps = {
  isEdit?: boolean
  product: Product
}

type SalesChannelBadgeProps = {
  channel: SalesChannel
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

  const { salesChannels, setSalesChannels } = useProductForm()

  const { count, isLoading: isLoadingSalesChannels } = useAdminSalesChannels()
  const { store, isLoading: isLoadingStore } = useAdminStore()

  const isLoading = isLoadingSalesChannels || isLoadingStore

  useEffect(() => {
    if (!isEdit && !isLoadingStore && store?.default_sales_channel) {
      setSalesChannels([store.default_sales_channel])
    }
  }, [isLoadingStore])

  const remainder = Math.max(product?.sales_channels?.length - 3, 0)
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
                {salesChannels?.slice(0, 3).map((sc) => (
                  <SalesChannelBadge channel={sc} />
                ))}
              </div>
              {remainder > 0 && (
                <Badge variant="ghost">
                  <div className="flex items-center h-full inter-base-regular text-grey-50">
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

const SalesChannelBadge: React.FC<SalesChannelBadgeProps> = ({ channel }) => {
  return (
    <Badge variant="ghost" className="px-4">
      <div className="flex py-1.5 items-center">
        <span className="inter-base-regular text-grey-90">{channel.name}</span>
      </div>
    </Badge>
  )
}

export default SalesChannels
