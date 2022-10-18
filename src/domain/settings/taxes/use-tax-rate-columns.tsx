import React, { useMemo } from "react"
import Badge from "../../../components/fundamentals/badge"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"

const useTaxRateColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: (<span className="pl-2">Name</span>),
        accessor: "name",
        Cell: ({ row, cell: { value } }) => {
          return (
            <div className="text-grey-90 group-hover:text-violet-60 pl-2">
              {row.original.type === "region" ? (
                <div className="flex gap-x-xsmall text-grey-40 items-center">
                  <LockIcon size={"12"} /> {value}
                </div>
              ) : value}
            </div>
          )
        },
      },
      {
        Header: "Code",
        accessor: "code",
        Cell: ({ cell: { value } }) => (
          <Badge variant="default">
            {value}
          </Badge>
        ),
      },
      {
        Header: "Tax Rate",
        accessor: "rate",
        Cell: ({ row, cell: { value } }) => (
          <>{value} %</>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useTaxRateColumns
