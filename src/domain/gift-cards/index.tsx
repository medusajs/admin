import { Router } from "@reach/router"
import { useAdminProducts } from "medusa-react"
import React from "react"
import ManageGiftCard from "./manage"
import Overview from "./overview"

const GiftCard = () => {
  const { products: giftCards } = useAdminProducts({ is_giftcard: "true" })

  return (
    <Router>
      <Overview path="/" />
      <ManageGiftCard path="manage" id={giftCards?.[0]?.id} />
    </Router>
  )
}

export default GiftCard
