import { Product, SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"
import React from "react"
import Tooltip from "../../../../../components/atoms/tooltip"
import Badge from "../../../../../components/fundamentals/badge"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import ChannelsIcon from "../../../../../components/fundamentals/icons/channels-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import StatusSelector from "../../../../../components/molecules/status-selector"
import Section from "../../../../../components/organisms/section"
import { useFeatureFlag } from "../../../../../context/feature-flag"
import useToggleState from "../../../../../hooks/use-toggle-state"
import ChannelsModal from "./channels-modal"
import GeneralModal from "./general-modal"
import useGeneralActions from "./use-general-actions"

type Props = {
  product: Product
}

const GeneralSection = ({ product }: Props) => {
  const { onDelete, onStatusChange } = useGeneralActions(product.id)
  const {
    state: infoState,
    close: closeInfo,
    toggle: toggleInfo,
  } = useToggleState()

  const {
    state: channelsState,
    close: closeChannels,
    toggle: toggleChannels,
  } = useToggleState(false)

  const { isFeatureEnabled } = useFeatureFlag()

  const actions: ActionType[] = [
    {
      label: "Edit General Information",
      onClick: toggleInfo,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  if (isFeatureEnabled("sales_channels")) {
    actions.splice(1, 0, {
      label: "Edit Sales Channels",
      onClick: toggleChannels,
      icon: <ChannelsIcon size={20} />,
    })
  }

  return (
    <>
      <Section
        title={product.title}
        actions={actions}
        forceDropdown
        status={
          <StatusSelector
            isDraft={product?.status === "draft"}
            activeState="Published"
            draftState="Draft"
            onChange={() => onStatusChange(product.status)}
          />
        }
      >
        <p className="inter-base-regular text-grey-50 mt-2">
          {product.description}
        </p>
        <ProductTags product={product} />
        <ProductDetails product={product} />
        <ProductSalesChannels product={product} />
      </Section>

      <GeneralModal product={product} open={infoState} onClose={closeInfo} />

      <FeatureToggle featureFlag="sales_channels">
        <ChannelsModal
          product={product}
          open={channelsState}
          onClose={closeChannels}
        />
      </FeatureToggle>
    </>
  )
}

type DetailProps = {
  title: string
  value?: string | null
}

const Detail = ({ title, value }: DetailProps) => {
  return (
    <div className="flex justify-between items-center inter-base-regular text-grey-50">
      <p>{title}</p>
      <p>{value ? value : "–"}</p>
    </div>
  )
}

const ProductDetails = ({ product }: Props) => {
  return (
    <div className="flex flex-col gap-y-3 mt-8">
      <h2 className="inter-base-semibold">Details</h2>
      <Detail title="Handle" value={product.handle} />
      <Detail title="Type" value={product.type?.value} />
      <Detail title="Collection" value={product.collection?.title} />
    </div>
  )
}

const ProductTags = ({ product }: Props) => {
  if (product.tags?.length === 0) {
    return null
  }

  return (
    <ul className="flex items-center gap-x-1 mt-4">
      {product.tags.map((t) => (
        <li key={t.id}>
          <div className="text-grey-50 bg-grey-10 inter-small-semibold px-3 py-[6px] rounded-rounded">
            {t.value}
          </div>
        </li>
      ))}
    </ul>
  )
}

type SalesChannelBadgeProps = {
  channel: SalesChannel
}

const SalesChannelBadge: React.FC<SalesChannelBadgeProps> = ({ channel }) => {
  return (
    <Badge variant="ghost" className="px-3 py-1.5">
      <div className="flex items-center">
        <span className="inter-small-regular text-grey-90">{channel.name}</span>
      </div>
    </Badge>
  )
}

const ProductSalesChannels = ({ product }: Props) => {
  const { count } = useAdminSalesChannels()
  const remainder = Math.max(product?.sales_channels?.length - 3, 0)

  return (
    <FeatureToggle featureFlag="sales_channels">
      <div className="mt-8">
        <h2 className="inter-base-semibold">Sales channels</h2>
        <div className="flex gap-x-1 mb-small mt-xsmall">
          <div className="flex gap-x-1 max-w-[600px] overflow-clip">
            {product.sales_channels?.slice(0, 3).map((sc) => (
              <SalesChannelBadge channel={sc} />
            ))}
          </div>
          {remainder > 0 && (
            <Tooltip
              content={
                <div className="flex flex-col">
                  {product.sales_channels.slice(3).map((sc) => {
                    return <span key={sc.id}>{sc.name}</span>
                  })}
                </div>
              }
            >
              <Badge variant="ghost">
                <div className="flex items-center h-full inter-base-regular text-grey-50">
                  + {remainder} more
                </div>
              </Badge>
            </Tooltip>
          )}
        </div>
        <p className="inter-base-regular text-grey-50">
          Available in{" "}
          <span className="inter-base-semibold text-grey-90">
            {product.sales_channels?.length ? product.sales_channels.length : 0}
          </span>{" "}
          out of{" "}
          <span className="inter-base-semibold text-grey-90">{count || 0}</span>{" "}
          Sales Channels
        </p>
      </div>
    </FeatureToggle>
  )
}

export default GeneralSection
