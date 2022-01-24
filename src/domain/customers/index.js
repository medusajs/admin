import { Router } from "@reach/router"
import qs from "query-string"
import React from "react"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import Details from "./details"

const CustomerIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

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
        subtitle="Manage the Customers of your store"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Overview"
          subtitle="An overview of all of your existing customers"
          className="mb-0"
        >
          <div className="flex grow  flex-col pt-2 mt-large">
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
