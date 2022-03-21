import React from "react"
import { Customer, CustomerGroup } from "@medusajs/medusa"
import { Column } from "react-table"

import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import SortingIcon from "../../fundamentals/icons/sorting-icon"
import CustomersGroupsSummary from "../../molecules/customers-groups-summary"

export const CUSTOMER_GROUPS_TABLE_COLUMNS: Column<CustomerGroup>[] = [
  {
    Header: "Title",
    accessor: "name",
  },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Members <SortingIcon size={16} />
      </div>
    ),
    id: "members",
    accessor: (r) => r.customers?.length,
  },
]

export const CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS: Column<Customer>[] = [
  {
    Header: "Name",
    accessor: "customer",
    Cell: ({ row }) => (
      <CustomerAvatarItem customer={row.original} color={getColor(row.index)} />
    ),
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    accessor: "groups",
    Header: () => <div className="text-left">Segments</div>,
    Cell: ({ cell: { value } }) => <CustomersGroupsSummary groups={value} />,
  },
]

export const CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS: Column<
  Customer
>[] = [
  {
    Header: "Name",
    accessor: "customer",
    Cell: ({ row }) => (
      <CustomerAvatarItem customer={row.original} color={getColor(row.index)} />
    ),
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    accessor: "groups",
    Header: () => (
      <div className="flex items-center gap-1 justify-start">
        Groups <SortingIcon size={16} />
      </div>
    ),
    Cell: ({ cell: { value } }) => <CustomersGroupsSummary groups={value} />,
  },
  {
    Header: "",
    id: "settings-col",
  },
]
