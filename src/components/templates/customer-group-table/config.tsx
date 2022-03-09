import React from "react"

import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import Checkbox from "../../atoms/checkbox"

export const CUSTOMER_GROUPS_TABLE_COLUMNS = [
  {
    Header: "Title",
    accessor: "name",
  },
  {
    Header: "Members",
    accessor: (r) => r.customers?.length,
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Total sales",
    accessor: "sales",
  },
  {
    Header: "Total revenue",
    accessor: "revenue",
  },
]

export const CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS = [
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
    Header: "",
    accessor: "col",
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
    accessor: "col-2",
  },
]

export const CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS = [
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
    accessor: "Groups",
    Header: () => <div className="text-right">Groups</div>,
    Cell: ({ cell: { value } }) => (
      <div className="text-right">{value?.length || 0}</div>
    ),
  },
  {
    accessor: "orders",
    Header: () => <div className="text-right">Orders</div>,
    Cell: ({ cell: { value } }) => {
      return <div className="text-right">{value?.length || 0}</div>
    },
  },
  {
    Header: "",
    accessor: "col-2",
  },
]
