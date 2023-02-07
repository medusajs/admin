import React, { useMemo } from "react"
import ImagePlaceholder from "../../fundamentals/image-placeholder"

const useProductTableColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Item",
        accessor: "variant.product.title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.variant.product?.thumbnail ? (
                  <img
                    src={original.variant.product.thumbnail}
                    className="object-cover h-full rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.variant.product.title}
            </div>
          )
        },
      },
      {
        Header: "Variant",
        accessor: "variant.title", // accessor is the "key" in the data
        Cell: ({ row: { original } }) => {
          return <div>{original?.variant.title || "-"}</div>
        },
      },
      {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Incoming",
        accessor: "location_levels.incoming_quantity",
        Cell: ({ row: { original } }) => (
          <div>
            {original.location_levels.reduce(
              (acc, next) => acc + next.incoming_quantity,
              0
            )}
          </div>
        ),
      },
      {
        Header: "In stock",
        accessor: "location_levels.stocked_quantity",
        Cell: ({ row: { original } }) => (
          <div>
            {original.location_levels.reduce(
              (acc, next) => acc + next.stocked_quantity,
              0
            )}
          </div>
        ),
      },
    ],
    []
  )

  return [columns] as const
}

export default useProductTableColumn
