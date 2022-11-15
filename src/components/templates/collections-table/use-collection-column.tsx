import moment from "moment"
import React, { useMemo } from "react"
import Tooltip from "../../atoms/tooltip"
import ImagePlaceholder from "../../fundamentals/image-placeholder"

const useCollectionTableColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Title",
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
        Header: "Handle",
        accessor: "handle",
        Cell: ({ cell: { value } }) => <div>/{value}</div>,
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <Tooltip content={moment(value).format("DD MMM YYYY hh:mm A")}>
            {moment(value).format("DD MMM YYYY")}
          </Tooltip>
        ),
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: ({ cell: { value } }) => (
          <Tooltip content={moment(value).format("DD MMM YYYY hh:mm A")}>
            {moment(value).format("DD MMM YYYY")}
          </Tooltip>
        ),
      },
      {
        Header: "Products",
        accessor: "products",
        Cell: ({ cell: { value } }) => {
          return <div>{value?.length || "-"}</div>
        },
      },
    ],
    []
  )

  return [columns]
}

export default useCollectionTableColumn
