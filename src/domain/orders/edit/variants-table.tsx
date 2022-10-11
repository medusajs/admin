import { useAdminVariants } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import { ProductVariant } from "@medusajs/medusa"
import clsx from "clsx"

import { useDebounce } from "../../../hooks/use-debounce"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import Table, { TablePagination } from "../../../components/molecules/table"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import Spinner from "../../../components/atoms/spinner"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../../components/atoms/tooltip"

const PAGE_SIZE = 12

type Props = {
  isReplace?: boolean
  setSelectedVariants: (selectedIds: ProductVariant[]) => void
}

const VariantsTable: React.FC<Props> = (props) => {
  const { isReplace, setSelectedVariants } = props

  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const debouncedSearchTerm = useDebounce(query, 500)

  const { isLoading, count, variants } = useAdminVariants({
    q: debouncedSearchTerm,
    limit: PAGE_SIZE,
    offset,
  })

  useEffect(() => {
    if (typeof count !== "undefined") {
      setNumPages(Math.ceil(count / PAGE_SIZE))
    }
  }, [count])

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">Name</div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.product.thumbnail ? (
                  <img
                    src={original.product.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.product.title}</span>
                {original.title}
              </div>
            </div>
          )
        },
      },
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">SKU</div>
        ),
        accessor: "sku",
        Cell: ({ row: { original } }) => <div>{original.sku}</div>,
      },
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">Options</div>
        ),
        accessor: "options",
        Cell: ({ row: { original } }) => (
          <div className="truncate max-w-[160px]">
            <span>
              {original.options?.map(({ value }) => value).join(", ")}
            </span>
          </div>
        ),
      },
      {
        Header: (
          <div className="text-right text-gray-500 text-small font-semibold">
            In Stock
          </div>
        ),
        accessor: "inventory_quantity",
        Cell: ({ row: { original } }) => (
          <div className="text-right">{original.inventory_quantity}</div>
        ),
      },
      {
        Header: (
          <div className="text-right text-gray-500 text-small font-semibold">
            Price
          </div>
        ),
        accessor: "amount",
        Cell: ({ row: { original } }) => {
          // TODO: which price to select ?
          // also if we want to display comparison between prices how do we compare them since
          // a variant could have for example a price of 100USD and 100EUR
          const price = original.prices[0]
          if (!price) {
            return null
          }

          return (
            <div className="text-right">
              {formatAmountWithSymbol({
                amount: price.amount,
                currency: price.currency_code,
              })}

              <span className="text-gray-400">
                {" "}
                {price.currency_code.toUpperCase()}
              </span>
            </div>
          )
        },
      },
    ]
  }, [])

  const table = useTable(
    {
      columns,
      data: variants || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: PAGE_SIZE,
        selectedRowIds: {},
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
          Header: ({ getToggleAllRowsSelectedProps }) => {
            if (isReplace) {
              return null
            }

            return (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllRowsSelectedProps()}
                  type={isReplace ? "radio" : "checkbox"}
                />
              </div>
            )
          },
          Cell: ({ row, toggleAllRowsSelected, toggleRowSelected }) => {
            const currentState = row.getToggleRowSelectedProps()
            const selectProps = row.getToggleRowSelectedProps()

            return (
              <div className={clsx({ "mr-2": isReplace })}>
                <IndeterminateCheckbox
                  {...selectProps}
                  disabled={row.original.inventory_quantity === 0}
                  type={isReplace ? "radio" : "checkbox"}
                  onChange={
                    isReplace
                      ? () => {
                          toggleAllRowsSelected(false)
                          toggleRowSelected(row.id, !currentState.checked)
                        }
                      : selectProps.onChange
                  }
                />
              </div>
            )
          },
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    if (!variants) {
      return
    }

    const selected = variants.filter(
      (v) => table.state.selectedRowIds[v.id] && v.inventory_quantity > 0
    )

    setSelectedVariants(selected)
  }, [table.state.selectedRowIds, variants])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset((old) => old + table.state.pageSize)
      setCurrentPage((old) => old + 1)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset((old) => Math.max(old - table.state.pageSize, 0))
      setCurrentPage((old) => old - 1)
      table.previousPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setCurrentPage(0)
    setQuery(q)
  }

  return (
    <>
      <Table
        immediateSearchFocus
        enableSearch
        searchPlaceholder="Search Product Variants..."
        handleSearch={handleSearch}
        {...table.getTableProps()}
      >
        {table.headerGroups.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}

        <Table.Body {...table.getTableBodyProps()}>
          {isLoading ? (
            <Spinner size="large" />
          ) : (
            table.rows.map((row) => {
              const isDisabled = row.original.inventory_quantity === 0

              table.prepareRow(row)
              return (
                <Table.Row
                  {...row.getRowProps()}
                  className={isDisabled && "opacity-50 pointer-events-none"}
                >
                  {/*TODO: TOOLTIP CSS doesn't work with table layout*/}
                  {/*<Tooltip*/}
                  {/*  side="top"*/}
                  {/*  open={isDisabled ? undefined : false}*/}
                  {/*  content="This variant is out of stock, and does not allow backorders"*/}
                  {/*>*/}
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Table.Cell>
                    )
                  })}
                  {/*</Tooltip>*/}
                </Table.Row>
              )
            })
          )}
        </Table.Body>
      </Table>
      <TablePagination
        count={count!}
        limit={PAGE_SIZE}
        offset={offset}
        pageSize={offset + table.rows.length}
        title="Products"
        currentPage={table.state.pageIndex + 1}
        pageCount={table.pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={table.canNextPage}
        hasPrev={table.canPreviousPage}
      />
    </>
  )
}

export default VariantsTable
