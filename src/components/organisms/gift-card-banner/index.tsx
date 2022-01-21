import React, { useMemo } from "react"
import StatusIndicator from "../../atoms/status-indicator"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import BannerCard from "../../molecules/banner-card"
import TagGrid from "../../molecules/tag-grid.tsx"

type GiftCardVariant = {
  prices: {
    currency_code: string
    amount: number
  }[]
}

type GiftCardBannerProps = {
  title: string
  status: string
  thumbnail?: string
  description: string
  variants: GiftCardVariant[]
  defaultCurrency: string
  onEdit: () => void
  onUnpublish: () => void
  onDelete: () => void
}

const GiftCardBanner: React.FC<GiftCardBannerProps> = ({
  title,
  status,
  thumbnail,
  description,
  variants,
  defaultCurrency,
  onEdit,
  onUnpublish,
  onDelete,
}) => {
  const actions: ActionType[] = [
    {
      label: "Edit",
      onClick: onEdit,
      icon: <EditIcon size={16} />,
    },
    {
      label: "Unpublish",
      onClick: onUnpublish,
      icon: <UnpublishIcon size={16} />,
    },
    {
      label: "Delete",
      onClick: onDelete,
      icon: <TrashIcon size={16} />,
      variant: "danger",
    },
  ]

  const denominations = useMemo(() => {
    return variants
      .map((variant) => {
        const price = variant.prices.find(
          (price) => price.currency_code === defaultCurrency
        )

        if (!price) return ""

        return `${price.amount / 100} ${defaultCurrency.toUpperCase()}`
      })
      .filter(Boolean)
  }, [variants, defaultCurrency])

  return (
    <BannerCard title={title} thumbnail={thumbnail} actions={actions}>
      <BannerCard.Description>{description}</BannerCard.Description>
      <BannerCard.Footer>
        <div className="flex items-center justify-between">
          <TagGrid tags={denominations} badgeVariant="denomination" />
          <StatusIndicator
            ok={status === "published"}
            okText="Published"
            notOkText="Unpublished"
          />
        </div>
      </BannerCard.Footer>
    </BannerCard>
  )
}

export default GiftCardBanner
