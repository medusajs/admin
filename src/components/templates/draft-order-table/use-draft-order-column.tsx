import moment from "moment"
import React, { useMemo } from "react"
import { getColor } from "../../../utils/color"
import StatusDot from "../../fundamentals/status-indicator"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import Table from "../../molecules/table"

const useDraftOrderTableColumns = () => {
  const decideStatus = (status) => {
    switch (status) {
      case "completed":
        return <StatusDot variant="success" title={"Completed"} />
      default:
        return <StatusDot variant="primary" title={"Open"} />
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Draft",
        accessor: "display_id",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="pl-2">{`#${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Order",
        accessor: "order_display_id",
        Cell: ({ row }, index) => (
          <Table.Cell key={index}>
            {row.original.order?.display_id
              ? `#${row.original.order?.display_id}`
              : ""}
          </Table.Cell>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            {moment(value).format("DD MMM YYYY")}
          </Table.Cell>
        ),
      },
      {
        Header: "Customer",
        accessor: "shipping_address",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            <CustomerAvatarItem
              customer={{
                first_name: value?.first_name || "",
                last_name: value?.last_name || "",
              }}
              color={getColor(row.index)}
            />
          </Table.Cell>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="pr-2">
            {decideStatus(value)}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useDraftOrderTableColumns
