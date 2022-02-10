import { Router } from "@reach/router"
import { navigate } from "gatsby"
import {
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import useNotification from "../../hooks/use-notification"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"
import GiftCardDetails from "./details"
import ManageGiftCard from "./manage"
import Overview from "./overview"

const GiftCard = () => {
  const { products: giftCards, isLoading } = useAdminProducts({
    is_giftcard: "true",
  })
  const giftCard = giftCards?.[0]

  const updateGiftCard = useAdminUpdateProduct(giftCard?.id)
  const deleteGiftCard = useAdminDeleteProduct(giftCard?.id)

  const notification = useNotification()

  const updateGCStatus = () => {
    let status: ProductStatus = ProductStatus.PUBLISHED
    if (giftCard?.status === "published") {
      status = ProductStatus.DRAFT
    }

    updateGiftCard.mutate(
      { status },
      {
        onSuccess: () =>
          notification("Success", "Successfully updated Gift Card", "success"),
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  const updateGC = (data) => {
    updateGiftCard.mutate(
      { ...data },
      {
        onSuccess: () =>
          notification("Success", "Successfully updated Gift Card", "success"),
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  const deleteGC = () => {
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        navigate("/a/gift-cards")
      },
    })
  }

  return (
    <Router>
      <Overview
        path="/"
        giftCard={giftCards?.[0]}
        onDelete={() => deleteGC()}
        onUpdate={() => updateGCStatus()}
        isLoading={isLoading}
      />
      <GiftCardDetails path=":id" />
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
