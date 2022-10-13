import { PriceList } from "@medusajs/medusa"
import { isArray } from "lodash"
import React, { useMemo } from "react"
import { Column } from "react-table"
import Actionables from "../../molecules/actionables"
import usePriceListActions from "./use-price-list-actions"
import { formatPriceListGroups, getPriceListStatus } from "./utils"

export const usePriceListTableColumns = () => {
  const columns = useMemo<Column<PriceList>[]>(
    () => [
      {
        Header: (<span>Name</span>),
        accessor: "name",
        Cell: ({ cell: { value } }) => (
          <span className="inter-small-regular">{value}</span>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value } }) => <>{value}</>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <>{getPriceListStatus(original)}</>
        ),
      },
      {
        Header: () => <div className="">Groups</div>,
        accessor: "customer_groups",
        Cell: ({ cell: { value } }) => {
          const groups: string[] = isArray(value)
            ? value.map((v) => v.name)
            : []
          const [group, other] = formatPriceListGroups(groups)
          return (
            <>
              {group}
              {other && <span className="text-grey-40"> + {other} more</span>}
            </>
          )
        },
      },
      {
        accessor: "created_at",
        Cell: ({ row: { original: priceList } }) => {
          const { getActions } = usePriceListActions(priceList)
          return (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full flex justify-end"
            >
              <div className="justify-end">
                <Actionables forceDropdown actions={getActions()} />
              </div>
            </div>
          )
        },
      },
    ],
    []
  )

  return [columns] as const
}
