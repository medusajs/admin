import React, { useMemo } from "react"
import { Column } from "react-table"
import StatusIndicator from "../../fundamentals/status-indicator"
import Table from "../../molecules/table"
import { AddCollectionProductTableItem } from "./types"

const useCollectionProductColumns = () => {
  const decideStatus = (status: string) => {
    switch (status) {
      case "published":
        return (
          <div className="flex items-center justify-end">
            <StatusIndicator title="Published" variant="success" />
          </div>
        )
      case "draft":
        return <StatusIndicator title="Draft" variant="default" />
      case "proposed":
        return <StatusIndicator title="Proposed" variant="warning" />
      case "rejected":
        return <StatusIndicator title="Rejected" variant="danger" />
      default:
        return null
    }
  }

  const columns: Column<AddCollectionProductTableItem>[] = useMemo(
    () => [
      {
        accessor: "thumbnail",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="w-[5%]">
            <div className="h-[40px] w-[30px] bg-grey-5 rounded-soft overflow-hidden my-xsmall">
              {value ? (
                <img
                  src={value}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          </Table.Cell>
        ),
      },
      {
        accessor: "title",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="w-3/6">{value}</Table.Cell>
        ),
      },
      {
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="w-[10%] pr-base">
            {decideStatus(value)}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return columns
}

export default useCollectionProductColumns
