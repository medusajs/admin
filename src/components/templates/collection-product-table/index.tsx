import React, { useEffect, useState } from "react"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"

type CollectionProductTableItem = {
  id: string
  thumbnail?: string
  title: string
  status: string
}

type CollectionProductTableProps = {
  loadingProducts: boolean
  products?: CollectionProductTableItem[]
  handleSearch: (value: string) => void
  rowElement: (item: CollectionProductTableItem) => React.ReactNode
}

const CollectionProductTable: React.FC<CollectionProductTableProps> = ({
  loadingProducts,
  products,
  handleSearch,
}) => {
  const [filteringOptions, setFilteringOptions] = useState<
    FilteringOptionProps[]
  >([])
  const [shownProducts, setShownProducts] = useState<
    CollectionProductTableItem[]
  >([])

  useEffect(() => {
    setFilteringOptions([
      {
        title: "Sort by",
        options: [
          {
            title: "All",
            onClick: () => {},
          },
          {
            title: "Newest",
            onClick: () => {},
          },
          {
            title: "Oldest",
            onClick: () => {},
          },
        ],
      },
    ])

    setShownProducts(products ?? [])
  }, [products])

  return (
    <div className="w-full h-full overflow-y-scroll">
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchPlaceholder="Search Products"
        filteringOptions={filteringOptions}
      >
        {loadingProducts && !products ? (
          <div className="w-full flex items-center justify-center h-44">
            <Spinner size="large" variant="secondary" />
          </div>
        ) : (
          <div>
            {shownProducts?.map((product, index) => (
              <p key={index}>{product.id}</p>
            ))}
          </div>
        )}
      </Table>
    </div>
  )
}

export default CollectionProductTable
