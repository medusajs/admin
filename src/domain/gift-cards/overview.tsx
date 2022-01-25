import { RouteComponentProps } from "@reach/router"
import {
  useAdminDeleteProduct,
  useAdminGiftCards,
  useAdminProducts,
  useAdminStore,
} from "medusa-react"
import qs from "query-string"
import React, { useContext, useEffect, useMemo, useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import { InterfaceContext } from "../../context/interface"
import useToaster from "../../hooks/use-toaster"
import { getErrorMessage } from "../../utils/error-messages"
import NewGiftCard from "./new"

type InvalidGiftCard = {
  id: "null"
}

const Overview: React.FC<RouteComponentProps> = () => {
  const { products, refetch } = useAdminProducts({ is_giftcard: "true" })
  const { store } = useAdminStore()
  const { gift_cards: giftCards } = useAdminGiftCards()
  const toaster = useToaster()
  const [create, setCreate] = useState(false)

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

  const giftCard = useMemo(() => {
    if (!products || !store) return

    return { ...products[0], defaultCurrency: store.default_currency_code }
  }, [products, store])

  const deleteCard = useAdminDeleteProduct(giftCard.id)

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  const handleDelete = () => {
    if (!giftCard) return

    deleteCard.mutate(undefined, {
      onSuccess: () => {
        toaster("Successfully deleted Gift Card", "success")
        refetch()
      },
      onError: (err) => {
        toaster(getErrorMessage(err), "error")
      },
    })
  }

  return (
    <>
      <div className="flex flex-col grow h-full">
        <PageDescription
          title="Gift Cards"
          subtitle="Manage the settings for your Medusa Store"
        />
        <div className="mb-base">
          {giftCard ? (
            <GiftCardBanner
              {...giftCard}
              onDelete={handleDelete}
              onEdit={() => console.log("edit")}
              onUnpublish={() => console.log("unpublish")}
            />
          ) : (
            <BannerCard title="You're ready to sell your first gift card?">
              <BannerCard.Description
                cta={{
                  label: "Create Gift Card",
                  onClick: () => setCreate(true),
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
      {create && <NewGiftCard onClose={() => setCreate(!create)} />}
    </>
  )
}

export default Overview
