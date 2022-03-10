import React from "react"
import { useAdminCustomerGroups } from "medusa-react"
import { usePagination, useSortBy, useTable } from "react-table"
import { navigate } from "gatsby"
import qs from "qs"

import Table from "../../molecules/table"
import EditIcon from "../../fundamentals/icons/edit-icon"
import DetailsIcon from "../../fundamentals/details-icon"

import { CUSTOMER_GROUPS_TABLE_COLUMNS } from "./config"
import * as I from "./interface"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "orders",
}

const ALLOWED_FILTER_PARAMS = ["q", "offset", "limit"]

function checkExisting(e?: string) {
  if (e?.charAt(0) === "?") return e.substring(0)
  return e
}

function parseQuery(
  queryString: string = "",
  defaultFilters: I.CustomerGroupsDefaultFilters | null = null
) {
  const filterParams: I.CustomerGroupsFilters = {
    limit: 15,
    offset: 0,
  }
  const filters = qs.parse(queryString)
  Object.keys(filters)
    .filter(
      (f) => ALLOWED_FILTER_PARAMS.includes(f) && typeof filters[f] === "string"
    )
    .forEach((k) => {
      if (["offset", "limit"].includes(k)) {
        filterParams[k] = parseInt(filters[k] as string)
      } else if (k === "q") {
        filterParams.query = filters[k]
      }
    })

  return filterParams
}

function parseCustomerGroupFilters(
  existing?: string,
  defaultFilters: I.CustomerGroupsDefaultFilters | null = null
) {
  existing = checkExisting(existing)

  const queryObject = parseQuery(existing)

  return { queryObject }
}

function CustomerGroupTable() {
  const {
    reset,
    paginate,
    setQuery,
    queryObject,
    representationObject,
  } = parseCustomerGroupFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { customer_groups, isLoading, count } = useAdminCustomerGroups({
    expand: "customers",
  })

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
    state: { pageIndex },
  } = useTable(
    {
      columns: CUSTOMER_GROUPS_TABLE_COLUMNS,
      data: customer_groups || [],
      // manualPagination: true,
      // initialState: {
      //   pageSize: lim,
      //   pageIndex: offs / lim,
      // },
      // pageCount: numPages,
      autoResetPage: false,
    },
    // usePagination
    useSortBy
  )

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
      <Table {...getTableProps()}>
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell
                  className="w-[100px]"
                  {...col.getHeaderProps(col.getSortByToggleProps())}
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
                actions={[
                  {
                    label: "Edit",
                    onClick: () => navigate(row.original.id),
                    icon: <EditIcon size={20} />,
                  },
                  {
                    label: "Details",
                    onClick: () => navigate(row.original.id),
                    icon: <DetailsIcon size={20} />,
                  },
                ]}
                linkTo={row.original.id}
                {...row.getRowProps()}
              >
                {row.cells.map((cell, index) => (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render("Cell", { index })}
                  </Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default CustomerGroupTable
