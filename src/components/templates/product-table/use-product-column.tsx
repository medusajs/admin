import clsx from "clsx"
import moment from "moment"
import React, { useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { getColor } from "../../../utils/color"
import { formatAmountWithSymbol } from "../../../utils/prices"
import ListIcon from "../../fundamentals/icons/list-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import StatusDot from "../../fundamentals/status-indicator"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import Table from "../../molecules/table"

const useProductTableColumn = () => {
  const [showList, setShowList] = useState(true)

  const getProductStatus = (title) => {
    switch (title) {
      case "proposed":
        return <StatusIndicator title={"Proposed"} variant={"warning"} />
      case "published":
        return <StatusIndicator title={"Published"} variant={"success"} />
      case "rejected":
        return <StatusIndicator title={"Rejected"} variant={"danger"} />
      case "draft":
        return <StatusIndicator title={"Draft"} variant={"default"} />
      default:
        return <StatusIndicator title={title} variant={"default"} />
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.title}
            </div>
          )
        },
      },
      {
        Header: "Collection",
        accessor: "collection", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value?.title || "-"}</div>
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => getProductStatus(value),
      },
      {
        Header: "Inventory",
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div>
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {" in stock for "}
            {value.length} variant(s)
          </div>
        ),
      },
      {
        accessor: "col-3",
        Header: (
          <div className="text-right flex justify-end">
            <span
              onClick={() => setShowList(true)}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": showList,
                "text-grey-40": !showList,
              })}
            >
              <ListIcon size={20} />
            </span>
            <span
              onClick={() => setShowList(false)}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": !showList,
                "text-grey-40": showList,
              })}
            >
              <TileIcon size={20} />
            </span>
          </div>
        ),
      },
    ],
    [showList]
  )

  return [columns, showList, setShowList] as const
}

export default useProductTableColumn
