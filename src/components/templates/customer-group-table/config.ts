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
