import React, { useEffect, useState } from "react"
import { useAdminCustomerGroups, useAdminCustomers } from "medusa-react"
import { usePagination, useRowSelect, useTable } from "react-table"

import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import Table, { TablePagination } from "../../molecules/table"
import { CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS } from "./config"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import useQueryFilters from "../../../hooks/use-query-filters"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  additionalFilters: { expand: "groups" },
}

type EditCustomersTableProps = {
  onClose: () => void
  handleSubmit: () => void
  selectedCustomerIds: string[]
  setSelectedCustomerIds: (customerIds: string[]) => void
}

function EditCustomersTable(props: EditCustomersTableProps) {
  const {
    setSelectedCustomerIds,
    selectedCustomerIds,
    handleSubmit,
    onClose,
  } = props

  const { paginate, setQuery, queryObject } = useQueryFilters(defaultQueryProps)

  const [activeGroupId, setActiveGroupId] = useState()
  const { customer_groups } = useAdminCustomerGroups({ expand: "customers" })

  const { customers = [], count = 0 } = useAdminCustomers(queryObject)

  const data = activeGroupId
    ? customers?.filter((c) => c.groups.some((g) => g.id === activeGroupId))
    : customers

  const [numPages, setNumPages] = useState(0)

  const handleNext = () => {
    if (!table.canNextPage) return

    paginate(1)
    table.nextPage()
  }

  const handlePrev = () => {
    if (!table.canPreviousPage) return

    paginate(-1)
    table.previousPage()
  }

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / queryObject.limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const tableConfig = {
    columns: CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS,
    data: data,
    manualPagination: true,
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
    autoResetPage: false,
    getRowId: (row) => row.id,
  }

  const table = useTable(tableConfig, usePagination, useRowSelect, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
        ),
        Cell: ({ row }) => {
          return (
            <Table.Cell
              onClick={(e) => e.stopPropagation()}
              className="w-[100px]"
            >
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </Table.Cell>
          )
        },
      },
      ...columns,
    ])
  })

  useEffect(() => {
    setSelectedCustomerIds(Object.keys(table.state.selectedRowIds))
  }, [table.state.selectedRowIds])

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
              handleSearch={setQuery}
              searchValue={queryObject.q}
              {...table.getTableProps()}
            >
              <Table.Head>
                {table.headerGroups?.map((headerGroup) => (
                  <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((col, index) => (
                      <Table.HeadCell
                        className="w-[100px]"
                        {...col.getHeaderProps()}
                      >
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
                    <Table.Row
                      color={"inherit"}
                      linkTo={`/a/customers/${row.original.id}`}
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
              hasNext={table.anNextPage}
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
