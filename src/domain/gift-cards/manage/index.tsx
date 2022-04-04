import { useAdminProducts } from "medusa-react"
import React from "react"
import Spinner from "../../../components/atoms/spinner"
import { GiftCardFormProvider } from "./form/gift-card-form-context"
import { giftCardToFormValuesMapper } from "./form/mappers"
import Denominations from "./sections/denominations"
import Images from "./sections/images"
import Information from "./sections/information"

const ManageGiftCard: React.FC<RoRouteComponentPropsuter> = () => {
  const { products } = useAdminProducts({
    is_giftcard: "true",
  })

  const giftCard = products?.[0]

  if (!giftCard) {
    return (
      <div>
        <Spinner variant="secondary" size="large" />
      </div>
    )
  }

  return (
    <GiftCardFormProvider
      giftCard={giftCardToFormValuesMapper(giftCard)}
      onSubmit={() => {}}
    >
      <div className="flex flex-col gap-y-large pb-xlarge">
        <Information giftCard={giftCard} />
        <Denominations giftCard={giftCard} />
        <Images />
      </div>
    </GiftCardFormProvider>
  )
}

export default ManageGiftCard
