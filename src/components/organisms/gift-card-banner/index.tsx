import React, { useEffect, useState } from "react"
import DenominationBadge from "../../../components/atoms/denomination-badge"
import StatusIndicator from "../../atoms/status-indicator"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import BannerCard from "../banner-card"

type GiftCardBannerProps = {
  title: string
  status: string
  thumbnail?: string
  description: string
  variants: {
    prices: {
      currency_code: string
      amount: number
    }[]
  }[]
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

  const [denominations, setDenominations] = useState<
    { amount: number; currencyCode: string }[] | null
  >([])
  const [remainder, setRemainder] = useState(0)

  useEffect(() => {
    const denominations =
      variants.map(variant => {
        const price = variant.prices.find(
          price => price.currency_code === defaultCurrency
        )
        console.log(price, "price")
        console.log(defaultCurrency, variant.prices)
        return { amount: price?.amount, currencyCode: defaultCurrency }
      }) ?? []

    if (denominations.length > 6) {
      setDenominations(denominations.slice(0, 6))
      setRemainder(denominations.length - 6)
      return
    }

    setDenominations(denominations)
  }, [variants, defaultCurrency])

  console.log(denominations, variants)

  return (
    <BannerCard title={title} thumbnail={thumbnail} actions={actions}>
      <BannerCard.Description>{description}</BannerCard.Description>
      <BannerCard.Footer>
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-7 grid-rows-1">
            {denominations.map((denomination, index) => {
              return (
                <DenominationBadge
                  className="mr-2xsmall"
                  key={index}
                  amount={denomination.amount}
                  currencyCode={denomination.currencyCode}
                />
              )
            })}
            {remainder > 0 && (
              <div className="inline-block">
                <div className="py-[2px] px-xsmall bg-grey-10 rounded-rounded flex items-center justify-center">
                  <span className="inter-small-regular">+{remainder}</span>
                </div>
              </div>
            )}
          </div>
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
