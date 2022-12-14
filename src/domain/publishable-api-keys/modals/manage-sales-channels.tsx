import React, { useEffect, useState } from "react"
import {
  TableOptions,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"
import { AnimatePresence, motion } from "framer-motion"

import { SalesChannel } from "@medusajs/medusa"
import {
  useAdminAddPublishableKeySalesChannelsBatch,
  useAdminRemovePublishableKeySalesChannelsBatch,
  useAdminPublishableApiKeySalesChannels,
  useAdminSalesChannels,
} from "medusa-react"

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
import BackIcon from "../../../components/fundamentals/icons/back-icon"

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
  isEdit: boolean
  query: string
  selectedChannels: Map<string, SalesChannel>
  setSelectedChannels: (
    setter: (oldState: Map<string, SalesChannel>) => void
  ) => {}
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
    isEdit,
    query,
    offset,
    data,
    isLoading,
    count,
    setOffset,
    selectedChannels,
    setSelectedChannels,
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
      selectedRowIds: Object.keys(selectedChannels).reduce((prev, k) => {
        prev[k] = true
        return prev
      }, {}),
    },
    pageCount: Math.ceil(count / LIMIT),
    getRowId: (row) => row.id,
  }

  const table = useTable(tableConfig, usePagination, useRowSelect)

  useEffect(() => {
    setSelectedChannels((oldState) => {
      const newState = {}

      Object.keys(table.state.selectedRowIds).forEach((k) => {
        newState[k] = oldState[k] || data.find((d) => d.id === k)
      })
      return newState
    })
  }, [table.state.selectedRowIds, data])

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

type ManageSalesChannelsSideModalProps = {
  keyId?: string
  close: () => void
  isVisible: boolean
  setSelectedChannels: (arg: any) => void
  selectedChannels: Map<string, SalesChannel>
  isEdit?: boolean
}

function AddScreen(props: {
  isEdit?: boolean
  keyId: string
  close: () => void
  goBack: () => void
  isVisible: boolean
}) {
  const [selectedSalesChannels, setSelectedChannels] = useState({})
  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true }
  )

  const { mutateAsync: addSalesChannelsToKeyScope } =
    useAdminAddPublishableKeySalesChannelsBatch(props.keyId)

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
    }
  }, [props.isVisible])

  const onSave = () => {
    addSalesChannelsToKeyScope({
      sales_channel_ids: Object.keys(selectedSalesChannels).map((id) => ({
        id,
      })),
    })
      .then(() => {
        notification("Success", "Sales channels added to the scope", "success")
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while adding sales channels to the scope of the key",
          "success"
        )
      })
      .finally(props.goBack)
  }

  return (
    <div className="flex flex-col justify-between h-[100%] p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          <Button className="p-2" variant="secondary" onClick={props.goBack}>
            <BackIcon size={20} />
          </Button>
          Add sales channels
        </h3>
        <Button variant="ghost" onClick={props.close}>
          <CrossIcon size={20} className="text-grey-40" />
        </Button>
      </div>
      {/* === DIVIDER === */}

      <div className="flex-grow">
        <div className="flex justify-between items-center gap-2">
          <InputField
            name="name"
            type="string"
            value={search}
            className="my-4 h-[40px]"
            placeholder="Find channels"
            prefix={<SearchIcon size={16} />}
            onChange={setSearch}
          />
        </div>

        <SalesChannelTable
          isEdit
          query={search}
          data={data}
          offset={offset}
          count={count || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedSalesChannels}
          setSelectedChannels={setSelectedChannels}
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
        <Button
          size="small"
          variant="primary"
          onClick={onSave}
          disabled={!Object.keys(selectedSalesChannels).length}
        >
          Save and close
        </Button>
      </div>
    </div>
  )
}

function EditScreen(props: {
  isEdit?: boolean
  keyId: string
  close: () => void
  goAdd: () => void
  isVisible: boolean
}) {
  const { setSelectedChannels, selectedChannels, close } = props

  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminPublishableApiKeySalesChannels(
    props.keyId,
    // { query: search, limit: LIMIT, offset },
    undefined,
    { keepPreviousData: true }
  )

  const { mutateAsync: removeSalesChannelsToKeyScope } =
    useAdminRemovePublishableKeySalesChannelsBatch(props.keyId)

  const onSave = () => {
    removeSalesChannelsToKeyScope({
      sales_channel_ids: Object.keys(selectedChannels).map((id) => ({
        id,
      })),
    })
      .then(() => {
        notification(
          "Success",
          "Sales channels removed from the scope",
          "success"
        )
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while removing sales channels from the scope of the key",
          "success"
        )
      })
      .finally(close)
  }

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
    }
  }, [props.isVisible])

  return (
    <div className="flex flex-col justify-between h-[100%] p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          Remove sales channels
        </h3>
        <Button variant="ghost" onClick={props.close}>
          <CrossIcon size={20} className="text-grey-40" />
        </Button>
      </div>
      {/* === DIVIDER === */}

      <div className="flex-grow">
        <div className="flex justify-between items-center gap-2">
          <InputField
            name="name"
            type="string"
            value={search}
            className="my-4 h-[40px]"
            placeholder="Find channels"
            prefix={<SearchIcon size={16} />}
            onChange={setSearch}
          />
          {props.isEdit && (
            <Button
              className="flex-shrink-0 h-[40px]"
              variant="secondary"
              onClick={props.goAdd}
            >
              Add channels
            </Button>
          )}
        </div>

        <SalesChannelTable
          isEdit
          query={search}
          data={data}
          offset={offset}
          count={count || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
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
        <Button
          size="small"
          variant="primary"
          onClick={onSave}
          disabled={!Object.keys(selectedChannels).length}
        >
          Save and close
        </Button>
      </div>
    </div>
  )
}

/**
 * Publishable Key details container.
 */
function ManageSalesChannelsSideModal(
  props: ManageSalesChannelsSideModalProps
) {
  const {
    isEdit,
    isVisible,
    keyId,
    close,
    selectedChannels,
    setSelectedChannels,
  } = props

  const [isAddNew, setIsAddNew] = useState(false)

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <AnimatePresence>
        {!isAddNew && (
          <motion.div
            style={{ height: "100%" }}
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -520 }}
          >
            <EditScreen
              key="edit"
              close={close}
              keyId={keyId}
              isEdit={isEdit}
              isVisible={isVisible}
              goAdd={() => setIsAddNew(true)}
              selectedChannels={selectedChannels}
              setSelectedChannels={setSelectedChannels}
            />
          </motion.div>
        )}
        {isAddNew && (
          <motion.div
            key="add"
            style={{ height: "100%" }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 520 }}
          >
            <AddScreen
              close={close}
              keyId={keyId}
              isEdit={isEdit}
              isVisible={isVisible}
              goBack={() => setIsAddNew(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SideModal>
  )
}

export default ManageSalesChannelsSideModal
