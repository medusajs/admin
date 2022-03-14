import React from "react"
import { Customer, CustomerGroup } from "@medusajs/medusa"
import { Column } from "react-table"

import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import SortingIcon from "../../fundamentals/icons/sorting-icon"

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
    accessor: "segments",
    Header: () => <div className="text-right">Segments</div>,
    Cell: ({ cell: { value } }) => (
      <div className="text-right">{value?.groups?.length || 0}</div>
    ),
  },
  {
    Header: "",
    id: "settings-col",
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
      <div className="flex items-center gap-1 justify-end">
        Groups <SortingIcon size={16} />
      </div>
    ),
    Cell: ({ cell: { value } }) => (
      <div className="text-right pr-1">{value?.length || 0}</div>
    ),
  },
  {
    Header: "",
    id: "settings-col",
  },
]
