import { isArray } from "lodash"
import React, { useMemo } from "react"
import Table from "../../molecules/table"
import { formatPriceListGroups, getPriceListStatus } from "./utils"

export const usePriceListTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: <Table.HeadCell>Name</Table.HeadCell>,
        accessor: "name",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            <span className="inter-small-regular">{value}</span>
          </Table.Cell>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original }, index }) => (
          <Table.Cell key={index}>{getPriceListStatus(original)}</Table.Cell>
        ),
      },
      {
        Header: () => <div className="">Groups</div>,
        accessor: "customer_groups",
        Cell: ({ cell: { value }, index }) => {
          const groups: string[] = isArray(value)
            ? value.map((v) => v.name)
            : []
          const [group, other] = formatPriceListGroups(groups)
          return (
            <Table.Cell className="" key={index}>
              {group}
              {other && <span className="text-grey-40"> + {other} more</span>}
            </Table.Cell>
          )
        },
      },
      {
        Header: "",
        accessor: "col",
      },
    ],
    []
  )

  return [columns]
}
