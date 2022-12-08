import React, { useEffect, useState } from "react"
import {
  TableOptions,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"

import { SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"

import Button from "../../../components/fundamentals/button"
import SideModal from "../../../components/molecules/modal/side-modal"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import useNotification from "../../../hooks/use-notification"
import InputField from "../../../components/molecules/input"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import TableContainer from "../../../components/organisms/table-container"
import Table from "../../../components/molecules/table"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import { TablePagination } from "../../../components/organisms/table-container/pagination"

/* ************************************* */
/* *************** TABLE *************** */
/* ************************************* */

const LIMIT = 12

const COLUMNS = [
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
]

type SalesChannelTableProps = {
  query: string
  setSelectedRowIds: (ids: string[]) => {}
  offset: number
  setOffset: (offset: number) => void
  data: SalesChannel[]
  isLoading: boolean
  count: number
}

/**
 * Sales channels select table.
 */
function SalesChannelTable(props: SalesChannelTableProps) {
  const {
    query,
    offset,
    data,
    isLoading,
    count,
    setOffset,
    setSelectedRowIds,
  } = props

  const tableConfig: TableOptions<SalesChannel> = {
    data,
    // @ts-ignore
    columns: COLUMNS,
    autoResetPage: false,
    manualPagination: true,
    autoResetSelectedRows: false,
    initialState: {
      pageIndex: Math.floor(offset / LIMIT),
      pageSize: LIMIT,
    },
    pageCount: Math.ceil(count / LIMIT),
    getRowId: (row) => row.id,
  }

  const table = useTable(tableConfig, usePagination, useRowSelect)

  useEffect(() => {
    setSelectedRowIds(Object.keys(table.state.selectedRowIds))
  }, [table.state.selectedRowIds])

  useEffect(() => {
    setOffset(0)
    table.gotoPage(0)
  }, [query])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset(offset + LIMIT)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset(Math.max(offset - LIMIT, 0))
      table.previousPage()
    }
  }

  return (
    <>
      <TableContainer hasPagination numberOfRows={LIMIT} isLoading={isLoading}>
        <Table {...table.getTableProps()}>
          <Table.Head>
            {table.headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          <Table.Body {...table.getTableBodyProps()}>
            {table.rows.map((row) => {
              table.prepareRow(row)
              return (
                <Table.Row color={"inherit"} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </TableContainer>
      <div className="absolute w-[506px]" style={{ bottom: 100 }}>
        <TablePagination
          pagingState={{
            count,
            offset,
            title: "Sales Channels",
            pageSize: offset + table.rows.length,
            currentPage: table.state.pageIndex + 1,
            pageCount: table.pageCount,
            nextPage: handleNext,
            prevPage: handlePrev,
            hasNext: table.canNextPage,
            hasPrev: table.canPreviousPage,
          }}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}

/* ****************************************** */
/* *************** SIDE MODAL *************** */
/* ****************************************** */

type AddSalesChannelsSideModalProps = {
  close: () => void
  isVisible: boolean
}

/**
 * Publishable Key details container.
 */
function AddSalesChannelsSideModal(props: AddSalesChannelsSideModalProps) {
  const { close, isVisible } = props

  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (!isVisible) {
      setOffset(0)
      setSearch("")
    }
  }, [isVisible])

  const onSave = async () => {}

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <div className="flex flex-col justify-between h-[100%] p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold text-xl text-gray-900">
            Add sales channels
          </h3>
          <Button variant="ghost" onClick={close}>
            <CrossIcon size={20} className="text-grey-40" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div className="flex-grow">
          <InputField
            name="name"
            type="string"
            value={search}
            className="my-4"
            placeholder="Find channels"
            prefix={<SearchIcon size={16} />}
            onChange={({ target: { value } }) => setSearch(value)}
          />

          <SalesChannelTable
            query={search}
            data={data}
            offset={offset}
            count={count || 0}
            setOffset={setOffset}
            isLoading={isLoading}
            selectedRowIds={selectedRowIds}
            setSelectedRowIds={setSelectedRowIds}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="h-[1px] bg-gray-200 block"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={onSave} disabled>
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default AddSalesChannelsSideModal
