import { Router } from "@reach/router"
import { navigate } from "gatsby"
import {
  useAdminDeleteProduct,
  useAdminGiftCards,
  useAdminProducts,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import useToaster from "../../hooks/use-toaster"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"
import ManageGiftCard from "./manage"
import Overview from "./overview"

const GiftCard = () => {
  const { gift_cards: purchasedGiftCards } = useAdminGiftCards()
  const { products: giftCards } = useAdminProducts({ is_giftcard: "true" })
  const giftCard = giftCards?.[0]

  const updateGiftCard = useAdminUpdateProduct(giftCard?.id)
  const deleteGiftCard = useAdminDeleteProduct(giftCard?.id)

  const toaster = useToaster()

  const updateGCStatus = () => {
    let status: ProductStatus = ProductStatus.PUBLISHED
    if (giftCard?.status === "published") {
      status = ProductStatus.DRAFT
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
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        toaster("Successfully deleted Gift Card")
        navigate("/a/gift-cards")
      },
      onError: (err) => {
        toaster(getErrorMessage(err))
      },
    })
  }

  return (
    <Router>
      <Overview
        path="/"
        onDelete={() => deleteGC()}
        onUpdate={() => updateGCStatus()}
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
