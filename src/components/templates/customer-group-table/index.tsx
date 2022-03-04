import React from "react"

import { useAdminCustomerGroups } from "medusa-react"

import Table from "../../molecules/table"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "orders",
}

function useCustomerGroupsFilter() {}

function CustomerGroupTable() {
  // const {
  //   reset,
  //   paginate,
  //   setQuery,
  //   queryObject,
  //   representationObject,
  // } = useCustomerGroupsFilter(location.search, defaultQueryProps)

  // const offs = parseInt(queryObject?.offset) || 0
  // const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  console.log({ useAdminCustomerGroups })
  const { customer_groups, isLoading, count } = useAdminCustomerGroups()
  console.log({ customer_groups })

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-[100px]">Header 1</Table.HeadCell>
            <Table.HeadCell className="w-[100px]">Header 2</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
      </Table>
    </div>
  )
}

export default CustomerGroupTable
