import { useAdminProducts } from "medusa-react"
import React, { useEffect, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import Table, { TablePagination } from "../../molecules/table"
import useCollectionProductColumns from "./use-collection-product-columns"

type AddProductsTableProps = {
  addedProducts: any[]
  setProducts: (products: any) => void
}

const AddProductsTable: React.FC<AddProductsTableProps> = ({
  addedProducts,
  setProducts,
}) => {
  const limit = 10
  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  const debouncedSearchTerm = useDebounce(query, 500)

  const { isLoading, count, products } = useAdminProducts({
    q: debouncedSearchTerm,
    limit: limit,
    offset,
  })

  const columns = useCollectionProductColumns()

  const {
    rows,
    prepareRow,
    getTableBodyProps,
    getTableProps,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      data: products || [],
      columns: columns,
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
        selectedRowIds: addedProducts.reduce((prev, { id }) => {
          prev[id] = true
          return prev
        }, {}),
      },
      pageCount: numPages,
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Cell: ({ row }) => {
            return (
              <Table.Cell className="w-[5%] pl-base">
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </Table.Cell>
            )
          },
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    setSelectedProducts((selectedProducts) => [
      ...selectedProducts.filter(
        (sv) => Object.keys(selectedRowIds).findIndex((id) => id === sv.id) > -1
      ),
      ...(products?.filter(
        (p) =>
          selectedProducts.findIndex((sv) => sv.id === p.id) < 0 &&
          Object.keys(selectedRowIds).findIndex((id) => id === p.id) > -1
      ) || []),
    ])
  }, [selectedRowIds])

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / limit)
    setNumPages(controlledPageCount)
  }, [products, count, limit])

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize)
      setCurrentPage((old) => old + 1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => old - pageSize)
      setCurrentPage((old) => old - 1)
      previousPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setQuery(q)
  }

  useEffect(() => {
    setProducts(selectedProducts)
  }, [selectedProducts])

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto">
      {isLoading || !products ? (
        <div className="inter-small-regular text-grey-40 flex flex-grow justify-center items-center">
          <Spinner size="large" variant="secondary" />
        </div>
      ) : (
        <Table
          enableSearch
          handleSearch={handleSearch}
          searchPlaceholder="Search Products"
          {...getTableProps()}
          className="h-full"
        >
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  {...row.getRowProps()}
                  className="px-base"
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index })
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      )}
      <TablePagination
        count={count!}
        limit={limit}
        offset={offset}
        pageSize={offset + rows.length}
        title="Products"
        currentPage={pageIndex + 1}
        pageCount={pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={canNextPage}
        hasPrev={canPreviousPage}
      />
    </div>
  )
}

export default AddProductsTable
