import React, { useEffect, useMemo, useState } from "react"
import { Column, TableOptions, usePagination, useTable } from "react-table"
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

  const columns: Column<CollectionProductTableItem>[] = useMemo(
    () => [
      {
        accessor: "thumbnail",
        Cell: ({ cell: { value } }) => (
          <div>{value ? <img src={value} /> : null}</div>
        ),
      },
      {
        accessor: "title",
        Cell: ({ cell: { value } }) => <div>{value}</div>,
      },
    ],
    []
  )

  const { rows, prepareRow, getTableBodyProps, getTableProps } = useTable(
    {
      data: shownProducts,
      columns: columns,
    },
    usePagination
  )

  return (
    <div className="w-full h-full overflow-y-scroll">
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchPlaceholder="Search Products"
        filteringOptions={filteringOptions}
        {...getTableProps()}
      >
        {loadingProducts || !products ? (
          <div className="w-full flex items-center justify-center flex-grow">
            <Spinner size="large" variant="secondary" />
          </div>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell", { index })}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        )}
      </Table>
    </div>
  )
}

export default CollectionProductTable
