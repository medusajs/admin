import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminGiftCards, useAdminStore } from "medusa-react"
import qs from "query-string"
import React, { useContext, useEffect, useMemo, useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import DeletePrompt from "../../components/organisms/delete-prompt"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import { InterfaceContext } from "../../context/interface"
import NewGiftCard from "./new"

type OverviewProps = {
  giftCard: any
  onDelete: () => void
  onUpdate: () => void
} & RouteComponentProps

const Overview: React.FC<OverviewProps> = ({
  giftCard,
  onDelete,
  onUpdate,
}) => {
  const { store } = useAdminStore()
  const { gift_cards: giftCards } = useAdminGiftCards()
  const [showCreate, setShowCreate] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const searchQuery = (q: string) => {
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      fields: "id,title,thumbnail",
      expand: "variants,variants.prices,collection",
      q,
      offset: 0,
      limit: 20,
    }

    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    // TODO: Refresh
  }

  const actionables = [
    {
      label: "Custom Gift Card",
      onClick: () => console.log("create custom gift card"), // TODO: open modal
      icon: <PlusIcon size={20} />,
    },
  ]

  const giftCardWithCurrency = useMemo(() => {
    if (!giftCard || !store) return null

    return { ...giftCard, defaultCurrency: store.default_currency_code }
  }, [giftCard, store])

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  return (
    <>
      <div className="flex flex-col grow h-full">
        <PageDescription
          title="Gift Cards"
          subtitle="Manage the settings for your Medusa Store"
        />
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
                No gift card have been added yet. Click the "Create Gift Card"
                button to add one. This is a growth opportunity!
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
      </div>
      {showCreate && <NewGiftCard onClose={() => setShowCreate(!showCreate)} />}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => onDelete()}
          successText="Successfully deleted Gift Card"
          confirmText="Yes, delete"
        />
      )}
    </>
  )
}

export default Overview
