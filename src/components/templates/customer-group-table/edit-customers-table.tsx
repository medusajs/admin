import React, { useEffect, useMemo, useState } from "react"
import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import { useCustomerFilters } from "../customer-table/use-customer-filters"
import { useAdminCustomers } from "medusa-react"
import { CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS } from "./config"
import { Cell, usePagination, useTable } from "react-table"
import Table, { TablePagination } from "../../molecules/table"
import { Customer } from "@medusajs/medusa"
import Checkbox from "../../atoms/checkbox"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "groups",
}

type EditCustomersTableProps = {
  onClose: () => void
  handleSubmit: () => void
  selectedCustomerIds: string[]
  toggleCustomer: (customerId: string) => void
}

function EditCustomersTable(props: EditCustomersTableProps) {
  const { toggleCustomer, selectedCustomerIds, handleSubmit, onClose } = props

  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useCustomerFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { customers: customersRes, isLoading, count } = useAdminCustomers({
    ...queryObject,
  })

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / lim)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const customers = useMemo(() => [...(customersRes || [])], [
    customersRes,
    selectedCustomerIds,
  ])

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
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns: CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS,
      data: customers || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const getRowCheckboxProps = (cell: Cell<Customer>) => {
    const customerId = cell.row.original.id
    const checked = selectedCustomerIds.includes(customerId)

    return {
      checked,
      toggleChecked: () => toggleCustomer(customerId),
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
            <Table enableSearch handleSearch={setQuery} {...getTableProps()}>
              <Table.Head>
                {headerGroups?.map((headerGroup) => (
                  <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((col, index) => (
                      <Table.HeadCell
                        className={index ? "w-[100px]" : "w-[60px]"}
                        {...col.getHeaderProps()}
                      >
                        {!index ? (
                          <Checkbox
                            className="justify-center"
                            // checked={checked}
                            // onChange={toggleChecked}
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                            }}
                          />
                        ) : (
                          col.render("Header")
                        )}
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
                      linkTo={row.original.id}
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell, index) => {
                        const additionalProps = getRowCheckboxProps(cell)
                        return (
                          <Table.Cell {...cell.getCellProps()}>
                            {cell.render("Cell", { index, ...additionalProps })}
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
