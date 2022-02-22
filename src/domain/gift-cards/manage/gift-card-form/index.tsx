import React from "react"
import Denominations from "./sections/denominations"
import General from "./sections/general"
import Images from "./sections/images"

type GiftCardFormProps = {
  giftCard: any
}

const GiftCardForm: React.FC<GiftCardFormProps> = ({ giftCard }) => {
  return (
    <>
      <div>
        <General giftCard={giftCard} />
      </div>
      <div className="mt-large">
        <Denominations giftCard={giftCard} />
      </div>
      <div className="mt-large">
        <Images />
      </div>
    </>
  )
}

export default GiftCardForm
