import { useAdminCustomers } from "medusa-react"
import moment from "moment"
import qs from "query-string"
import React, { useState } from "react"
import DetailsIcon from "../fundamentals/details-icon"
import EditIcon from "../fundamentals/icons/edit-icon"
import CustomerAvatarItem from "../molecules/customer-avatar-item"
import Table from "../molecules/table"

type CustomerTableProps = {
  customers: any[]
}

const getColor = (index: number): string => {
  const colors = [
    "bg-fuschia-40",
    "bg-pink-40",
    "bg-orange-40",
    "bg-teal-40",
    "bg-cyan-40",
    "bg-blue-40",
    "bg-indigo-40",
  ]
  return colors[index % colors.length]
}

const CustomerTable: React.FC<CustomerTableProps> = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad?.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad?.limit) {
    filtersOnLoad.limit = 14
  }

  const { customers, isLoading, count, refetch } = useAdminCustomers({
    expand: "orders",
    limit: filtersOnLoad.limit,
    offset: filtersOnLoad.offset,
  })

  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(14)
  const [query, setQuery] = useState("")

  const searchQuery = (q) => {
    setOffset(0)
    refetch({ q, offset: 0, limit })
    // const baseUrl = qs.parseUrl(window.location.href).url
  }

  const getUserTableRow = (customer, index) => {
    return (
      <Table.Row
        key={`customer-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Details",
            onClick: () => console.log("heelo"),
            icon: <DetailsIcon size={20} />,
          },
          {
            label: "Edit",
            onClick: () => console.log("heelo"),
            icon: <EditIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          {moment(customer.created_at).format("DD MMM YYYY")}
        </Table.Cell>
        <Table.Cell className="">
          <CustomerAvatarItem customer={customer} color={getColor(index)} />
        </Table.Cell>
        <Table.Cell className="">{customer.email}</Table.Cell>
        <Table.Cell>{customer?.orders?.length || 0}</Table.Cell>
      </Table.Row>
    )
  }

  return (
    <div className="w-full h-full overflow-y-scroll">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        handleSearch={searchQuery}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">Date added</Table.HeadCell>
            <Table.HeadCell className="w-80">Name</Table.HeadCell>
            <Table.HeadCell className="w-72">Email</Table.HeadCell>
            <Table.HeadCell className="w-72">Orders</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {customers?.map((customer, index) =>
            getUserTableRow(customer, index)
          ) || []}
        </Table.Body>
      </Table>
    </div>
  )
}

export default CustomerTable
