import {
  CustomerGroup,
  Product,
  ProductCollection,
  ProductTag,
  ProductType,
} from "@medusajs/medusa"
import { debounce } from "lodash"
import React, { useEffect } from "react"
import {
  Column,
  HeaderGroup,
  Row,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"
import Spinner from "../../../../components/atoms/spinner"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import Table, {
  TablePagination,
  TableProps,
} from "../../../../components/molecules/table"
import useQueryFilters from "../../../../hooks/use-query-filters"

type SelectableTableProps = {
  resourceName?: string
  label?: string
  isLoading?: boolean
  totalCount: number
  options: Omit<TableProps, "filteringOptions"> & {
    filters?: Pick<TableProps, "filteringOptions">
  }
  data?:
    | Product[]
    | ProductType[]
    | ProductCollection[]
    | ProductTag[]
    | CustomerGroup[]
  selectedIds?: string[]
  columns: Column[]
  onChange: (items: string[]) => void
  renderRow: (props: { row: Row }) => React.ReactElement
  renderHeaderGroup?: (props: {
    headerGroup: HeaderGroup
  }) => React.ReactElement
} & ReturnType<typeof useQueryFilters>

export const SelectableTable: React.FC<SelectableTableProps> = ({
  label,
  resourceName = "",
  selectedIds = [],
  isLoading,
  totalCount = 0,
  data,
  columns,
  onChange,
  options,
  renderRow,
  renderHeaderGroup,
  setQuery,
  queryObject,
  paginate,
}) => {
  const table = useTable(
    {
      columns,
      data: data || [],
      manualPagination: true,
      initialState: {
        pageIndex: queryObject.offset / queryObject.limit,
        pageSize: queryObject.limit,
        selectedRowIds: selectedIds.reduce((prev, id) => {
          prev[id] = true
          return prev
        }, {}),
      },
      pageCount: Math.ceil(totalCount / queryObject.limit),
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row: any) => row.id,
    },
    usePagination,
    useRowSelect,
    useSelectionColumn
  )

  useEffect(() => {
    onChange(Object.keys(table.state.selectedRowIds))
  }, [table.state.selectedRowIds])

  const handleNext = () => {
    if (!table.canNextPage) {
      return
    }

    paginate(1)
    table.nextPage()
  }

  const handlePrev = () => {
    if (!table.canPreviousPage) {
      return
    }

    paginate(-1)
    table.previousPage()
  }

  const handleSearch = (text: string) => {
    setQuery(text)

    if (text) {
      table.gotoPage(0)
    }
  }

  const debouncedSearch = React.useMemo(() => debounce(handleSearch, 300), [])

  return (
    <div>
      <div className="inter-base-semibold my-large">{label}</div>
      <Table
        {...options}
        {...table.getTableProps()}
        handleSearch={options.enableSearch ? debouncedSearch : undefined}
      >
        {renderHeaderGroup && (
          <Table.Head>
            {table.headerGroups?.map((headerGroup) =>
              renderHeaderGroup({ headerGroup })
            )}
          </Table.Head>
        )}

        <Table.Body {...table.getTableBodyProps()}>
          {isLoading ? (
            <Spinner size="large" />
          ) : (
            table.rows.map((row, i) => {
              table.prepareRow(row)
              return renderRow({ row })
            })
          )}
        </Table.Body>
      </Table>

      <TablePagination
        count={totalCount!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + table.rows.length}
        title={resourceName}
        currentPage={table.state.pageIndex + 1}
        pageCount={table.pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={table.canNextPage}
        hasPrev={table.canPreviousPage}
      />
    </div>
  )
}

const useSelectionColumn = (hooks) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => {
        return (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        )
      },
      Cell: ({ row }) => {
        return (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        )
      },
    },
    ...columns,
  ])
}
