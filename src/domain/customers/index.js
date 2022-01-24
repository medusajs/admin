import { Router } from "@reach/router"
import { useAdminCustomers } from "medusa-react"
import qs from "query-string"
import React, { useContext, useEffect, useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import { InterfaceContext } from "../../context/interface"
import useMedusa from "../../hooks/use-medusa"
import Details from "./details"

const CustomerIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { customers, isLoading } = useAdminCustomers({
    expand: ["orders"],
    limit: filtersOnLoad.limit,
    offset: filtersOnLoad.offset,
  })

  const { refresh, total_count } = useMedusa("customers", {
    search: `?${qs.stringify(filtersOnLoad)}`,
  })
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)
  const [query, setQuery] = useState("")

  const searchQuery = (q) => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q,
        offset: 0,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)
    refresh({ search: `?${prepared}` })
  }

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  // const handlePagination = (direction) => {
  //   const updatedOffset = direction === "next" ? offset + limit : offset - limit
  //   const baseUrl = qs.parseUrl(window.location.href).url

  //   const prepared = qs.stringify(
  //     {
  //       q: query,
  //       offset: updatedOffset,
  //       limit,
  //     },
  //     { skipNull: true, skipEmptyString: true }
  //   )

  //   window.history.pushState(baseUrl, "", `?${prepared}`)

  //   refresh({ search: `?${prepared}` }).then(() => {
  //     setOffset(updatedOffset)
  //   })
  // }

  // const moreResults = customers && customers.length >= limit

  return (
    <div className="flex flex-col grow h-full">
      <PageDescription
        title={"Customers"}
        subtitle="See the overview of customers"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard title="Overview" className="mb-0">
          <div className="flex grow  flex-col pt-2">
            <CustomerTable />
          </div>
        </BodyCard>
      </div>
    </div>
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
