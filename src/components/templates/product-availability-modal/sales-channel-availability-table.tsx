import { SalesChannel } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { TableInstance } from "react-table"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import { LayeredModalContext } from "../../molecules/modal/layered-modal"
import Table, { TablePagination } from "../../molecules/table"
import { useAddChannelsModalScreen } from "./add-channels-modal-screen"

type SalesChannelAvailabilityTableProps = {
  salesChannels: SalesChannel[]
  limit: number
  offset: number
  setOffset: (offset: number) => void
  setQuery: (query: string) => void
  setSelectedRowIds?: (selectedRowIds: string[]) => void
  tableAction?: React.ReactNode
  tableState: TableInstance<SalesChannel>
}

type SalesChannelTableActionsProps = {
  selectedRowIds: string[]
  chosenSalesChannelIds: string[]
  onAddSalesChannelsToSelected: (salesChannels: SalesChannel[]) => void
  onDeselect: () => void
  onRemove: () => void
}

export const useAvailableChannelsModalTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        width: 30,
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <span className="flex justify-center w-[30px]">
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
          </span>
        ),
        Cell: ({ row }) => {
          return (
            <span
              onClick={(e) => e.stopPropagation()}
              className="flex justify-center w-[30px]"
            >
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </span>
          )
        },
      },
      {
        Header: "Title",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],
    []
  )

  return [columns] as const
}

const SalesChannelAvailabilityTable: React.FC<SalesChannelAvailabilityTableProps> = ({
  salesChannels,
  limit,
  offset,
  setOffset,
  setQuery,
  tableState,
  setSelectedRowIds,
  tableAction,
}) => {
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
    // Get the state from the instance
    state: { pageIndex, ...state },
  } = tableState

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      setOffset(offset + limit)
    } else {
      setOffset(Math.max(offset - limit, 0))
    }
  }

  React.useEffect(() => {
    if (setSelectedRowIds) {
      setSelectedRowIds(Object.keys(state.selectedRowIds))
    }
  }, [Object.keys(state.selectedRowIds).length])

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  return (
    <div className="min-h-[350px] flex flex-col justify-between">
      <Table
        {...getTableProps()}
        enableSearch
        handleSearch={setQuery}
        tableActions={tableAction}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row color={"inherit"} {...row.getRowProps()}>
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
      </Table>
      <TablePagination
        count={salesChannels.length!}
        limit={limit}
        offset={offset}
        pageSize={offset + rows.length}
        title="Sales Channels"
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

export const SalesChannelTableActions: React.FC<SalesChannelTableActionsProps> = ({
  selectedRowIds,
  chosenSalesChannelIds,
  onAddSalesChannelsToSelected,
  onDeselect,
  onRemove,
}) => {
  const addChannelModalScreen = useAddChannelsModalScreen(
    chosenSalesChannelIds,
    onAddSalesChannelsToSelected
  )
  const { push } = React.useContext(LayeredModalContext)

  return (
    <div className="flex space-x-xsmall">
      {selectedRowIds?.length ? (
        <div className="divide-x flex items-center">
          <span className="mr-3 inter-small-regular text-grey-50">
            {selectedRowIds?.length} selected
          </span>
          <div className="flex space-x-xsmall pl-3">
            <Button
              onClick={onDeselect}
              size="small"
              variant="ghost"
              className="border border-grey-20"
            >
              Deselect
            </Button>
            <Button
              onClick={onRemove}
              size="small"
              variant="ghost"
              className="border border-grey-20 text-rose-50"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="small"
          variant="ghost"
          className="border border-grey-20"
          onClick={() => push(addChannelModalScreen)}
        >
          <PlusIcon size={20} /> Add Channels
        </Button>
      )}
    </div>
  )
}

export default SalesChannelAvailabilityTable
