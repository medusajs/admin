import { Customer } from "@medusajs/medusa"
import { useAdminCustomerGroups, useAdminCustomers } from "medusa-react"
import React, { useEffect, useState } from "react"
import {
  HeaderGroup,
  Row,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"
import useQueryFilters from "../../../hooks/use-query-filters"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import Table, { TablePagination } from "../../molecules/table"
import { CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS } from "./config"

/**
 * Default filtering config for querying customers endpoint.
 */
const defaultQueryProps = {
  additionalFilters: { expand: "groups" },
  limit: 15,
}

type EditCustomersTableHeaderRowProps = { headerGroup: HeaderGroup<Customer> }

/*
 * Edit customers table header row.
 */
function EditCustomersTableHeaderRow(props: EditCustomersTableHeaderRowProps) {
  const { headerGroup } = props

  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col, index) => (
        <Table.HeadCell className="w-[100px]" {...col.getHeaderProps()}>
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

type EditCustomersTableRowProps = { row: Row<Customer> }

/*
 * Edit customers table row.
 */
function EditCustomersTableRow(props: EditCustomersTableRowProps) {
  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/customers/${props.row.original.id}`}
      {...props.row.getRowProps()}
    >
      {props.row.cells.map((cell, index) => (
        <Table.Cell {...cell.getCellProps()}>
          {cell.render("Cell", { index })}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

type EditCustomersTableProps = {
  onClose: () => void
  handleSubmit: () => void
  selectedCustomerIds: string[]
  setSelectedCustomerIds: (customerIds: string[]) => void
}

/*
 * Container for the "edit customers" table.
 */
function EditCustomersTable(props: EditCustomersTableProps) {
  const {
    setSelectedCustomerIds,
    selectedCustomerIds,
    handleSubmit,
    onClose,
  } = props

  const {
    paginate,
    setQuery,
    setFilters,
    filters,
    queryObject,
  } = useQueryFilters(defaultQueryProps)

  const [numPages, setNumPages] = useState(0)
  const [activeGroupId, setActiveGroupId] = useState()

  const { customer_groups } = useAdminCustomerGroups({ expand: "customers" })
  const { customers = [], count = 0 } = useAdminCustomers({
    ...queryObject,
    groups: activeGroupId ? [activeGroupId] : null,
  })

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / queryObject.limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const tableConfig = {
    columns: CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS,
    data: customers,
    initialState: {
      pageSize: queryObject.limit,
      pageIndex: queryObject.offset / queryObject.limit,
      selectedRowIds: selectedCustomerIds.reduce((prev, id) => {
        prev[id] = true
        return prev
      }, {}),
    },
    pageCount: numPages,
    autoResetSelectedRows: false,
    manualPagination: true,
    autoResetPage: false,
    getRowId: (row) => row.id,
  }

  const table = useTable(tableConfig, usePagination, useRowSelect)

  useEffect(() => {
    setSelectedCustomerIds(Object.keys(table.state.selectedRowIds))
  }, [table.state.selectedRowIds])

  useEffect(() => {
    setFilters("offset", 0)
    table.gotoPage(0)
  }, [activeGroupId])

  const filteringOptions = [
    {
      title: "Groups",
      options: [
        {
          title: "All",
          onClick: () => setActiveGroupId(null),
        },
        ...(customer_groups || []).map((g) => ({
          title: g.name,
          count: g.customers.length,
          onClick: () => setActiveGroupId(g.id),
        })),
      ],
    },
  ]

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

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h3 className="inter-xlarge-semibold">Edit Customers</h3>
        </Modal.Header>

        <Modal.Content>
          <div className="w-full flex flex-col justify-between h-[650px]">
            <Table
              filteringOptions={filteringOptions}
              enableSearch
              handleSearch={handleSearch}
              searchValue={queryObject.q}
              {...table.getTableProps()}
            >
              <Table.Head>
                {table.headerGroups?.map((headerGroup) => (
                  <EditCustomersTableHeaderRow headerGroup={headerGroup} />
                ))}
              </Table.Head>

              <Table.Body {...table.getTableBodyProps()}>
                {table.rows.map((row) => {
                  table.prepareRow(row)
                  return <EditCustomersTableRow row={row} />
                })}
              </Table.Body>
            </Table>

            <TablePagination
              count={count!}
              limit={queryObject.limit}
              offset={queryObject.offset}
              pageSize={queryObject.offset + table.rows.length}
              title="Customers"
              currentPage={table.state.pageIndex + 1}
              pageCount={table.pageCount}
              nextPage={handleNext}
              prevPage={handlePrev}
              hasNext={table.canNextPage}
              hasPrev={table.canPreviousPage}
            />
          </div>
        </Modal.Content>

        <Modal.Footer>
          <div className="flex items-center justify-end gap-x-xsmall w-full">
            <Button
              variant="ghost"
              size="small"
              className="w-eventButton"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              className="w-eventButton"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditCustomersTable
