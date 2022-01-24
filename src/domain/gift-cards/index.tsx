import { Router } from "@reach/router"
import { navigate } from "gatsby"
import {
  useAdminDeleteProduct,
  useAdminGiftCards,
  useAdminProducts,
  useAdminStore,
  useAdminUpdateProduct,
} from "medusa-react"
import qs from "query-string"
import React, { useContext, useEffect } from "react"
import PageDescription from "../../components/atoms/page-description"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import { InterfaceContext } from "../../context/interface"
import useToaster from "../../hooks/use-toaster"
import { getErrorMessage } from "../../utils/error-messages"
import ManageGiftCard from "./manage"

const Index = ({ giftCards, giftCard, updateStatus, deleteGiftCard }) => {
  const { store } = useAdminStore()

  const searchQuery = (q) => {
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

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  const TopBanner = () => {
    if (giftCard) {
      return (
        <GiftCardBanner
          title={giftCard.title}
          status={giftCard.status}
          description={giftCard.description}
          thumbnail={giftCard.thumbnail}
          variants={giftCard.variants}
          defaultCurrency={store?.default_currency_code || ""}
          onEdit={() => navigate("/a/gift-cards/manage")}
          onUnpublish={() => updateStatus()}
          onDelete={() => deleteGiftCard()}
        />
      )
    } else {
      return (
        <BannerCard title="You’re ready to sell your first gift card?">
          <BannerCard.Description
            cta={{
              label: "Create Gift Card",
              onClick: () => console.log("TODO: Open modal"),
            }}
          >
            No gift card have been added yet. Click the "Create Gift Card"
            button to add one. This is a growth opportunity!
          </BannerCard.Description>
        </BannerCard>
      )
    }
  }

  return (
    <div className="flex flex-col grow h-full">
      <PageDescription
        title={"Gift Cards"}
        subtitle="Manage the Gift Cards of your store"
      />
      <div className="w-full flex flex-col grow space-y-4">
        <TopBanner />
        <BodyCard
          title="History"
          subtitle="See the history of purchased gift cards"
          actionables={actionables}
        >
          <GiftCardTable giftCards={giftCards} />
        </BodyCard>
      </div>
    </div>
  )
}

const GiftCard = () => {
  const { gift_cards: purchasedGiftCards } = useAdminGiftCards()
  const { products: giftCards } = useAdminProducts({ is_giftcard: "true" })
  const giftCard = giftCards?.[0]

  const updateGiftCard = useAdminUpdateProduct(giftCard?.id)
  const deleteGiftCard = useAdminDeleteProduct(giftCard?.id)

  const toaster = useToaster()

  const updateGCStatus = () => {
    let status = "published"
    if (giftCard?.status === "published") {
      status = "draft"
    }

    updateGiftCard.mutate(
      { status },
      {
        onSuccess: () => toaster("Successfully updated Gift Card", "success"),
        onError: (err) => toaster(getErrorMessage(err), "error"),
      }
    )
  }

  const updateGC = (data) => {
    updateGiftCard.mutate(
      { ...data },
      {
        onSuccess: () => toaster("Successfully updated Gift Card", "success"),
        onError: (err) => toaster(getErrorMessage(err), "error"),
      }
    )
  }

  const deleteGC = () => {
    deleteGiftCard.mutate(null, {
      onSuccess: () => {
        toaster("Successfully deleted Gift Card")
        navigate("/a/gift-cards")
      },
      onError: (err) => {
        toaster(getErrorMessage(err))
      },
    })
  }

  console.log(giftCard)

  return (
    <Router>
      <Index
        path="/"
        giftCards={purchasedGiftCards}
        giftCard={giftCards?.[0]}
        deleteGiftCard={() => deleteGC()}
        updateStatus={() => updateGCStatus()}
      />
      {giftCard && (
        <ManageGiftCard
          path="manage"
          id={giftCard.id}
          updateGiftCard={updateGC}
          deleteGiftCard={deleteGC}
        />
      )}
    </Router>
  )
}

export default GiftCard
