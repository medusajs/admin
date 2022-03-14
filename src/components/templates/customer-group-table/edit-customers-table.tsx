import React, { useEffect, useState } from "react"
import { useAdminCustomers } from "medusa-react"
import { usePagination, useRowSelect, useTable } from "react-table"

import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import Table, { TablePagination } from "../../molecules/table"
import { CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS } from "./config"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import useQueryFilters from "../../../hooks/use-query-filters"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "groups",
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

  const {
    reset,
    paginate,
    setQuery,
    queryObject,
    representationObject,
  } = useQueryFilters(defaultQueryProps) // TOOO: override search string

  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { customers = [], count } = useAdminCustomers(queryObject)

  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / lim)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, selectedRowIds },
  } = useTable(
    {
      columns: CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS,
      data: customers,
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
        selectedRowIds: selectedCustomerIds.reduce((prev, id) => {
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
    }
  )

  useEffect(() => {
    setSelectedCustomerIds(Object.keys(selectedRowIds))
  }, [selectedRowIds])

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h3 className="inter-xlarge-semibold">Edit Customers</h3>
        </Modal.Header>
        <Modal.Content>
          <div className="w-full flex flex-col justify-between h-[650px]">
            <Table
              enableSearch
              handleSearch={setQuery}
              searchValue={queryObject.q}
              {...getTableProps()}
            >
              <Table.Head>
                {headerGroups?.map((headerGroup) => (
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

              <Table.Body {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row)
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
              pageSize={queryObject.offset + rows.length}
              title="Customers"
              currentPage={pageIndex + 1}
              pageCount={pageCount}
              // nextPage={handleNext}
              // prevPage={handlePrev}
              hasNext={canNextPage}
              hasPrev={canPreviousPage}
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
