import { RouteComponentProps } from "@reach/router"
import { useAdminProduct } from "medusa-react"
import React from "react"
import Spinner from "../../../components/atoms/spinner"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import GiftCardForm from "./gift-card-form"
import { GiftCardFormProvider } from "./gift-card-form/form/gift-card-form-context"
import { giftCardToFormValuesMapper } from "./gift-card-form/form/mappers"

type ManageGiftCardProps = {
  id?: string
} & RouteComponentProps

const ManageGiftCard: React.FC<ManageGiftCardProps> = ({ id }) => {
  const { product: giftCard, isLoading, isError } = useAdminProduct(id!, {
    enabled: id !== undefined,
  })

  if (isLoading || id === undefined) {
    return (
      <div className="w-full pt-2xlarge flex items-center justify-center">
        <Spinner size={"large"} variant={"secondary"} />
      </div>
    )
  }

  if (isError || !giftCard) {
    return (
      <div className="w-full pt-2xlarge flex items-center justify-center">
        <Spinner size={"large"} variant={"secondary"} />
      </div>
    )
  }

  return (
    <div className="pb-xlarge">
      <BreadCrumb
        currentPage={"Manage Gift Card"}
        previousBreadcrumb={"Gift Cards"}
        previousRoute="/a/gift-cards"
      />
      <GiftCardFormProvider giftCard={giftCardToFormValuesMapper(giftCard)}>
        <GiftCardForm giftCard={giftCard} />
      </GiftCardFormProvider>
    </div>
  )
}

export default ManageGiftCard
