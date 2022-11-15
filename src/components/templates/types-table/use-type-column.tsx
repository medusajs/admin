import moment from "moment"
import React, { useMemo } from "react"
import Tooltip from "../../atoms/tooltip"
import ImagePlaceholder from "../../fundamentals/image-placeholder"

const useTypeTableColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "value",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-cover rounded-soft"
                    alt={"type"}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.value}
            </div>
          )
        },
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
    ],
    []
  )

  return [columns]
}

export default useTypeTableColumn
