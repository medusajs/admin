import React, { useEffect, useContext } from "react"
import { Router } from "@reach/router"
import qs from "query-string"
import { InterfaceContext } from "../../context/interface"

import ManageGiftCard from "./manage"
import GiftCardDetail from "./detail"
import useMedusa from "../../hooks/use-medusa"
import Breadcrumb from "../../components/molecules/breadcrumb"
import BodyCard from "../../components/organisms/body-card"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import GiftCardTable from "../../components/templates/gift-card-table"
import PageDescription from "../../components/atoms/page-description"

const Index = () => {
  const { gift_cards, refresh } = useMedusa("giftCards")

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
    refresh({ search })
  }

  const actionables = [
    {
      label: "Custom Gift Card",
      onClick: () => console.log("create custom gift card"), // TODO
      icon: <PlusIcon size={20} />,
    },
  ]

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <PageDescription
          title="Gift Cards"
          subtitle="Manage the Gift cards for your Medusa Store"
        />
        <BodyCard
          title="History"
          subtitle="See the history of purchased gift cards"
          actionables={actionables}
        >
          <GiftCardTable giftCards={gift_cards} />
        </BodyCard>
      </div>
    </div>
  )
}

const GiftCard = () => {
  return (
    <Router>
      <Index path="/" />
      <ManageGiftCard path="manage" />
      <GiftCardDetail path=":id" />
    </Router>
  )
}

export default GiftCard
