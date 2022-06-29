import moment from "moment"
import React, { useMemo } from "react"
import IconTooltip from "../../molecules/icon-tooltip"
import { formatAmountWithSymbol } from "../../../utils/prices"
import StatusIndicator from "../../fundamentals/status-indicator"
import Table from "../../molecules/table"

const useGiftCardTableColums = () => {
  const columns = useMemo(
    () => [
      {
        Header: <Table.HeadCell className="pl-2">Code</Table.HeadCell>,
        accessor: "code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2"
          >
            {value}
          </Table.Cell>
        ),
      },
      {
        Header: "Order",
        accessor: "order_id",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2"
          >
            {value}
          </Table.Cell>
        ),
      },
      {
        Header: "Original Amount",
        accessor: "value",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {row.original.region ? (
              formatAmountWithSymbol({
                amount: value,
                currency: row.original.region.currency_code,
              })
            ) : (
              <div className="flex items-center space-x-2">
                <span>N / A</span>
                <IconTooltip content={"Region has been deleted"} />
              </div>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: "Balance",
        accessor: "balance",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {value ? (
              row.original.region ? (
                formatAmountWithSymbol({
                  amount: value,
                  currency: row.original.region.currency_code,
                })
              ) : (
                <div className="flex items-center space-x-2">
                  <span>N / A</span>
                  <IconTooltip content={"Region has been deleted"} />
                </div>
              )
            ) : (
              <StatusIndicator title="None" variant="danger" />
            )}
          </Table.Cell>
        ),
      },
      {
        Header: () => (
          <div className="pr-2 flex rounded-rounded w-full justify-end">
            Date
          </div>
        ),
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell className="pr-2" key={index}>
            <div className="flex rounded-rounded w-full justify-end">
              {moment(value).format("MMM Do YYYY")}
            </div>
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useGiftCardTableColums
