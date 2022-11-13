import { useAdminProductTypes } from "medusa-react"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"
import useTypeActions from "./use-type-actions"
import useTypeTableColumn from "./use-type-column"
import TableContainer from "../../organisms/table-container"

const DEFAULT_PAGE_SIZE = 15

const TypesTable: React.FC = () => {
  const [filteringOptions, setFilteringOptions] = useState<
    FilteringOptionProps[]
  >([])
  const [offset, setOffset] = useState(0)
  const limit = DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState("")
  const [numPages, setNumPages] = useState(0)

  const debouncedSearchTerm = useDebounce(query, 500)
  const {
    product_types,
    isLoading,
    isRefetching,
    count,
  } = useAdminProductTypes({
    q: debouncedSearchTerm,
    offset: offset,
    limit,
  })

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const [columns] = useTypeTableColumn()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      // @ts-ignore
      columns,
      data: product_types || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / limit),
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + limit)
      nextPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setQuery(q)
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - limit)
      previousPage()
    }
  }

  useEffect(() => {
    setFilteringOptions([
      {
        title: "Sort",
        options: [
          {
            title: "All",
            count: product_types?.length || 0,
            onClick: () => console.log("Not implemented yet"),
          },
        ],
      },
    ])
  }, [product_types])

  return (
    <TableContainer
      isLoading={isLoading || isRefetching}
      hasPagination
      numberOfRows={limit}
      pagingState={{
        count: count!,
        offset,
        pageSize: offset + rows.length,
        title: "Types",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchPlaceholder="Search Types"
        filteringOptions={filteringOptions}
        searchValue={query}
        {...getTableProps()}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col, index) => (
                <Table.HeadCell
                  className="min-w-[100px]"
                  {...col.getHeaderProps()}
                  key={index}
                >
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {isLoading || isRefetching || !product_types ? (
          <Table.Body {...getTableBodyProps()}>
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <div className="w-full pt-2xlarge flex items-center justify-center">
                  <Spinner size={"large"} variant={"secondary"} />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row)
              return <TypeRow row={row} key={index} />
            })}
          </Table.Body>
        )}
      </Table>
    </TableContainer>
  )
}

const TypeRow = ({ row }) => {
  const type = row.original
  const { getActions } = useTypeActions(type)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/types/${type.id}`}
      actions={getActions(type)}
      key={type.id}
      {...row.getRowProps()}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell key={index} {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
export default TypesTable
