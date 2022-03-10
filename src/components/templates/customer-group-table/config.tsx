import React from "react"

import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import SortingIcon from "../../fundamentals/icons/sorting-icon"

export const CUSTOMER_GROUPS_TABLE_COLUMNS = [
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
  // {
  //   Header: "Status",
  //   accessor: "status",
  // },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Total sales <SortingIcon size={16} />
      </div>
    ),
    id: "totalSales",
    accessor: "sales",
  },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Total revenue <SortingIcon size={16} />
      </div>
    ),
    id: "totalRevenue",
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
    accessor: "orders",
    Header: () => (
      <div className="flex items-center gap-1 justify-end">
        Orders <SortingIcon size={16} />
      </div>
    ),
    Cell: ({ cell: { value } }) => {
      return <div className="text-right pr-1">{value?.length || 0}</div>
    },
  },
  {
    Header: "",
    accessor: "col-2",
  },
]
