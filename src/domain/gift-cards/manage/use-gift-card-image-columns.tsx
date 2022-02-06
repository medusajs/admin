import React, { useMemo } from "react"
import radioGroup from "../../../components/organisms/radio-group"

const useGiftCardImageColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ cell }) => {
          console.log({ cell })
          return (
            <div className="py-base large:w-[176px] xsmall:w-[80px]">
              <img
                className="h-[80px] w-[80px] object-cover rounded"
                src={cell.row.original.url}
              />
            </div>
          )
        },
      },
      {
        Header: "File Name",
        accessor: "name",
        Cell: ({ cell }) => {
          return (
            <div className="large:w-[700px] medium:w-[400px] small:w-auto">
              <p className="inter-small-regular">{cell.row.original?.name}</p>
              <span className="inter-small-regular text-grey-50">
                {typeof cell.row.original.size === "number"
                  ? `${(cell.row.original.size / 1024).toFixed(2)} KB`
                  : cell.row.original?.size}
              </span>
            </div>
          )
        },
      },
      {
        Header: <div className="text-center">Thumbnail</div>,
        accessor: "thumbnail",
        Cell: ({ cell }) => {
          return (
            <div className="flex justify-center">
              <radioGroup.SimpleItem
                className="justify-center"
                label=""
                value={cell.row.original.url}
              />
            </div>
          )
        },
      },
    ],
    []
  )

  return [columns] as const
}

export default useGiftCardImageColumns
