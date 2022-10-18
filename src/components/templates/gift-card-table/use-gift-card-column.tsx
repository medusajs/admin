import moment from "moment"
import React, { useMemo } from "react"
import IconTooltip from "../../molecules/icon-tooltip"
import { formatAmountWithSymbol } from "../../../utils/prices"
import StatusIndicator from "../../fundamentals/status-indicator"

const useGiftCardTableColums = () => {
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Code</div>,
        accessor: "code",
        Cell: ({ cell: { value } }) => (
          <span
            className="text-grey-90 group-hover:text-violet-60 w-[20%] pl-2"
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Order",
        accessor: "order_id",
        Cell: ({ row, cell: { value } }) => (
          <span
            className="text-grey-90 group-hover:text-violet-60 w-[10%] pl-2"
          >
            {value ? (
              row.original.order?.display_id
            ) : (
              <span className="text-grey-90">-</span>
            )}
          </span>
        ),
      },
      {
        Header: "Original Amount",
        accessor: "value",
        Cell: ({ row, cell: { value } }) => (
          <>
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
            </>
        ),
      },
      {
        Header: "Balance",
        accessor: "balance",
        Cell: ({ row, cell: { value }, index }) => (
          <>
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
            </>
        ),
      },
      {
        Header: () => (
          <div className="pr-2 flex rounded-rounded w-full justify-end">
            Created
          </div>
        ),
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <div className="pr-2" key={index}>
            <div className="flex rounded-rounded w-full justify-end">
              {moment(value).format("MMM Do YYYY")}
            </div>
          </div>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useGiftCardTableColums
