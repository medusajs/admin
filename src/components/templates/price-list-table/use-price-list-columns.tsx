import React, { useMemo } from "react"
import { useSelectionColumn } from "../../../hooks/use-selection-column"
import Table from "../../molecules/table"
import { formatPriceListGroups, getPriceListStatus } from "./utils"

export const usePriceListTableColumns = () => {
  const columns = useMemo(
    () => [
      useSelectionColumn(),
      {
        Header: <Table.HeadCell className="pl-2">Name</Table.HeadCell>,
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
          const [group, other] = formatPriceListGroups(
            value.map((v) => v.title)
          )
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
