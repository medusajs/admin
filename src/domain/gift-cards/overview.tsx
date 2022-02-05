import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminGiftCards, useAdminStore } from "medusa-react"
import React, { useMemo, useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import Spinner from "../../components/atoms/spinner"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import DeletePrompt from "../../components/organisms/delete-prompt"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import CustomGiftcard from "./custom-giftcard"
import NewGiftCard from "./new"

type OverviewProps = {
  giftCard: any
  onDelete: () => void
  onUpdate: () => void
  isLoading: boolean
} & RouteComponentProps

const Overview: React.FC<OverviewProps> = ({
  giftCard,
  onDelete,
  onUpdate,
  isLoading,
}) => {
  const { store } = useAdminStore()
  const { gift_cards: giftCards } = useAdminGiftCards()
  const [showCreate, setShowCreate] = useState(false)
  const [showCreateCustom, setShowCreateCustom] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const actionables = [
    {
      label: "Custom Gift Card",
      onClick: () => setShowCreateCustom(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  const giftCardWithCurrency = useMemo(() => {
    if (!giftCard || !store) {
      return null
    }

    return { ...giftCard, defaultCurrency: store.default_currency_code }
  }, [giftCard, store])

  return (
    <>
      <div className="flex flex-col grow h-full">
        <PageDescription
          title="Gift Cards"
          subtitle="Manage the settings for your Medusa Store"
        />
        {!isLoading ? (
          <>
            <div className="mb-base">
              {giftCardWithCurrency ? (
                <GiftCardBanner
                  {...giftCardWithCurrency}
                  onDelete={() => setShowDelete(true)}
                  onEdit={() => navigate("/a/gift-cards/manage")}
                  onUnpublish={onUpdate}
                />
              ) : (
                <BannerCard title="You're ready to sell your first gift card?">
                  <BannerCard.Description
                    cta={{
                      label: "Create Gift Card",
                      onClick: () => setShowCreate(true),
                    }}
                  >
                    No gift card have been added yet. Click the "Create Gift
                    Card" button to add one. This is a growth opportunity!
                  </BannerCard.Description>
                </BannerCard>
              )}
            </div>
            <div className="w-full flex flex-col grow">
              <BodyCard
                title="History"
                subtitle="See the history of purchased gift cards"
                actionables={actionables}
              >
                {giftCards && <GiftCardTable giftCards={giftCards} />}
              </BodyCard>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center h-44 rounded-rounded border border-grey-20">
            <Spinner variant="secondary" size="large" />
          </div>
        )}
      </div>
      {showCreateCustom && (
        <CustomGiftcard onDismiss={() => setShowCreateCustom(false)} />
      )}
      {showCreate && <NewGiftCard onClose={() => setShowCreate(!showCreate)} />}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => onDelete()}
          successText="Successfully deleted Gift Card"
          confirmText="Yes, delete"
          heading="Delete Gift Card"
        />
      )}
    </>
  )
}

export default Overview
