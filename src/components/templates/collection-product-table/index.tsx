import React, { useEffect, useState } from "react"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"

type CollectionProductTableProps = {
  loadingProducts: boolean
  products?: any[]
  handleSearch: (value: string) => void
}

const CollectionProductTable: React.FC<CollectionProductTableProps> = ({
  loadingProducts,
  products,
  handleSearch,
}) => {
  const [filteringOptions, setFilteringOptions] = useState<
    FilteringOptionProps[]
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
            {products?.map((product, index) => (
              <p key={index}>{JSON.stringify(product, undefined, 2)}</p>
            ))}
          </div>
        )}
      </Table>
    </div>
  )
}

export default CollectionProductTable
