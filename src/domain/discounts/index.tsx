import React, { useEffect, useRef, useState, useContext } from "react"
import qs from "query-string"
import { Router } from "@reach/router"
import New from "./new"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

import Spinner from "../../components/spinner"
import { navigate } from "gatsby"
import { InterfaceContext } from "../../context/interface"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import DiscountTable from "../../components/templates/discount-table"

const DiscountIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { discounts, refresh, isReloading, isLoading } = useMedusa(
    "discounts",
    {
      search: {
        is_disabled: "false",
        is_dynamic: "false",
        ...filtersOnLoad,
      },
    }
  )

  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [showDynamic, setShowDynamic] = useState(false)
  const [showDisabled, setShowDisabled] = useState(false)

  const searchRef = useRef(null)

  const searchQuery = (q) => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const queryParts = {
      q,
      offset: 0,
      limit: 20,
    }
    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({
      search: {
        is_dynamic: showDynamic,
        is_disabled: showDisabled,
        ...queryParts,
      },
    })
  }

  const actionables = [
    {
      label: "Add Discount",
      onClick: () => navigate(`/a/discounts/new`),
      icon: <PlusIcon size={20} />,
    },
  ]

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  const moreResults = discounts && discounts.length > limit

  return (
    <div className="h-full flex flex-col">
      <PageDescription
        title={"Discounts"}
        subtitle={"Manage the discounts for your Medusa store"}
      />
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Overview"
          subtitle="See the overview of created discounts"
          actionables={actionables}
        >
          <div className="flex grow flex-col">
            <DiscountTable />
          </div>
        </BodyCard>
      </div>
    </div>
  )
}

const Discounts = () => {
  return (
    <Router className="h-full">
      <DiscountIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Discounts
