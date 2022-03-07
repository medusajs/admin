export const CUSTOMER_GROUPS_TABLE_COLUMNS = [
  {
    Header: "Title",
    accessor: "name",
  },
  {
    Header: "Members",
    accessor: (r) => r.customers?.length,
  },
]
