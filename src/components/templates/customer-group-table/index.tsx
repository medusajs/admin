import React from "react"
import { useAdminCustomerGroups } from "medusa-react"
import qs from "qs"

import Table from "../../molecules/table"
import * as I from "./interface"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "orders",
}

const ALLOWED_FILTER_PARAMS = ["q", "offset", "limit"]

function checkExisting(e?: string) {
  if (e?.charAt(0) === "?") return e.substring(0)
  return e
}

function parseQuery(
  queryString: string = "",
  defaultFilters: I.CustomerGroupsDefaultFilters | null = null
) {
  const filterParams: I.CustomerGroupsFilters = {
    limit: 15,
    offset: 0,
  }
  const filters = qs.parse(queryString)
  Object.keys(filters)
    .filter(
      (f) => ALLOWED_FILTER_PARAMS.includes(f) && typeof filters[f] === "string"
    )
    .forEach((k) => {
      if (["offset", "limit"].includes(k)) {
        filterParams[k] = parseInt(filters[k] as string)
      } else if (k === "q") {
        filterParams.query = filters[k]
      }
    })

  return filterParams
}

function parseCustomerGroupFilters(
  existing?: string,
  defaultFilters: I.CustomerGroupsDefaultFilters | null = null
) {
  existing = checkExisting(existing)

  const queryObject = parseQuery(existing)

  return { queryObject }
}

function CustomerGroupTable() {
  const {
    reset,
    paginate,
    setQuery,
    queryObject,
    representationObject,
  } = parseCustomerGroupFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { customer_groups, isLoading, count } = useAdminCustomerGroups()

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Members</Table.HeadCell>
            <Table.HeadCell>Total sales</Table.HeadCell>
            <Table.HeadCell>Total revenue</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
      </Table>
    </div>
  )
}

export default CustomerGroupTable
