import { useEffect, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"

import { useAdminSalesChannels } from "medusa-react"

import Button from "../../../components/fundamentals/button"
import SideModal from "../../../components/molecules/modal/side-modal"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import useNotification from "../../../hooks/use-notification"
import InputField from "../../../components/molecules/input"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import TableContainer from "../../../components/organisms/table-container"
import Table from "../../../components/molecules/table"

/* ************************************* */
/* *************** TABLE *************** */
/* ************************************* */

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

const SalesChannelTable = ({
  selectedRowIds,
  setSelectedRowIds,
}: {
  selectedRowIds: string[]
  setSelectedRowIds: (ids: string[]) => {}
}) => {
  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels()

  const [query, setQuery] = useState<string | undefined>(undefined)
  const [offset, setOffset] = useState(0)

  const state = useTable(
    {
      // @ts-ignore
      columns: COLUMNS,
      data: data,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / 12),
        pageSize: 12,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.id,
      pageCount: Math.ceil(data.length / 12),
    },
    usePagination,
    useRowSelect
  )

  useEffect(() => {
    if (setSelectedRowIds) {
      setSelectedRowIds(Object.keys(selectedRowIds))
    }
  }, [selectedRowIds])

  const handleNext = () => {
    if (state.canNextPage) {
      setOffset(offset + 12)
      state.nextPage()
    }
  }

  const handlePrev = () => {
    if (state.canPreviousPage) {
      setOffset(Math.max(offset - 12, 0))
      state.previousPage()
    }
  }

  if (!data) {
    return null
  }

  return (
    <TableContainer
      hasPagination
      pagingState={{
        count: count,
        offset: offset,
        pageSize: offset + state.rows.length,
        title: "Sales Channels",
        currentPage: state.pageIndex + 1,
        pageCount: state.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: state.canNextPage,
        hasPrev: state.canPreviousPage,
      }}
      numberOfRows={12}
      isLoading={isLoading}
    >
      <Table {...state.getTableProps()} enableSearch handleSearch={setQuery}>
        <Table.Head>
          {state.headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        <Table.Body {...state.getTableBodyProps()}>
          {state.rows.map((row) => {
            state.prepareRow(row)
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
  const [search, setSearch] = useState("")

  const [selectedRowIds, setSelectedRowIds] = useState([])

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

        <div
          className="h-[1px] bg-gray-200 block"
          style={{ margin: "24px -24px" }}
        />
        {/* === BODY === */}

        <div className="flex-grow">
          <InputField
            type="string"
            name="name"
            value={search}
            placeholder="Find channels"
            prefix={<SearchIcon size={16} />}
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <SalesChannelTable
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
