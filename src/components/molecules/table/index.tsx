import clsx from "clsx"
import { navigate } from "gatsby"
import React from "react"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import SortingIcon from "../../fundamentals/icons/sorting-icon"
import Actionables, { ActionType } from "../../molecules/actionables"
import FilteringOptions, { FilteringOptionProps } from "./filtering-option"
import TableSearch from "./table-search"

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  forceDropdown?: boolean
  actions?: ActionType[]
  linkTo?: string
}

type TablePaginationProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  currentPage: number
  pageSize: number
  count: number
  offset: number
  limit: number
  pageCount: number
  nextPage: () => void
  prevPage: () => void
  hasNext: boolean
  hasPrev: boolean
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  linkTo?: string
  name?: string
}

type SortingHeadCellProps = {
  onSortClicked: () => void
  sortDirection?: "ASC" | "DESC"
  setSortDirection: (string) => void
} & React.HTMLAttributes<HTMLTableCellElement>

export type TableProps = {
  filteringOptions?: FilteringOptionProps[] | React.ReactNode
  tableActions?: React.ReactNode
  enableSearch?: boolean
  immediateSearchFocus?: boolean
  searchPlaceholder?: string
  searchValue?: string
  containerClassName?: string
  handleSearch?: (searchTerm: string) => void
} & React.HTMLAttributes<HTMLTableElement>

type TableElement<T> = React.ForwardRefExoticComponent<T> &
  React.RefAttributes<unknown>

type TableType = {
  Head: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  HeadRow: TableElement<React.HTMLAttributes<HTMLTableRowElement>>
  HeadCell: TableElement<React.ThHTMLAttributes<HTMLTableCellElement>>
  SortingHeadCell: TableElement<SortingHeadCellProps>
  Body: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  Row: TableElement<TableRowProps>
  Cell: TableElement<TableCellProps>
  Pagination: React.ForwardRefExoticComponent<TablePaginationProps> &
    React.RefAttributes<unknown>
} & TableElement<TableProps>

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      children,
      tableActions,
      enableSearch,
      immediateSearchFocus,
      searchPlaceholder,
      searchValue,
      handleSearch,
      filteringOptions,
      containerClassName,
      ...props
    },
    ref
  ) => {
    if (enableSearch && !handleSearch) {
      throw new Error("Table cannot enable search without a search handler")
    }

    return (
      <div className={`flex flex-col ${containerClassName}`}>
        <div className="w-full flex justify-between mb-2">
          {filteringOptions ? (
            <div className="flex mb-2 self-end">
              {Array.isArray(filteringOptions)
                ? filteringOptions.map((fo) => <FilteringOptions {...fo} />)
                : filteringOptions}
            </div>
          ) : (
            <span aria-hidden />
          )}
          <div className="flex items-center">
            {tableActions && <div className="mr-small">{tableActions}</div>}
            {enableSearch && (
              <TableSearch
                autoFocus={immediateSearchFocus}
                placeholder={searchPlaceholder}
                searchValue={searchValue}
                onSearch={handleSearch!}
              />
            )}
          </div>
        </div>
        <table
          ref={ref}
          className={clsx("w-full table-auto", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  }
) as TableType

Table.Head = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx(
      "whitespace-nowrap inter-small-semibold text-grey-50 border-t border-b border-grey-20",
      className
    )}
    {...props}
  >
    {children}
  </thead>
))

Table.HeadRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, children, ...props }, ref) => (
  <tr ref={ref} className={clsx(className)} {...props}>
    {children}
  </tr>
))

Table.HeadCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th ref={ref} className={clsx("text-left h-[40px]", className)} {...props}>
    {children}
  </th>
))

Table.SortingHeadCell = React.forwardRef<
  HTMLTableCellElement,
  SortingHeadCellProps
>(
  (
    {
      onSortClicked,
      sortDirection,
      setSortDirection,
      className,
      children,
      ...props
    }: SortingHeadCellProps,
    ref
  ) => {
    return (
      <th ref={ref} className={clsx("text-left py-2.5", className)} {...props}>
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={(e) => {
            e.preventDefault()
            if (!sortDirection) {
              setSortDirection("ASC")
            } else {
              if (sortDirection === "ASC") {
                setSortDirection("DESC")
              } else {
                setSortDirection(undefined)
              }
            }
            onSortClicked()
          }}
        >
          {children}
          <SortingIcon
            size={16}
            ascendingColor={sortDirection === "ASC" ? "#111827" : undefined}
            descendingColor={sortDirection === "DESC" ? "#111827" : undefined}
          />
        </div>
      </th>
    )
  }
)

Table.Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={clsx(className)} {...props}>
    {children}
  </tbody>
))

Table.Cell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, linkTo, children, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx("inter-small-regular h-[40px]", className)}
      {...props}
      {...(linkTo && {
        onClick: (e) => {
          navigate(linkTo)
          e.stopPropagation()
        },
      })}
    >
      {children}
    </td>
  )
)

Table.Row = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, actions, children, linkTo, forceDropdown, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        "inter-small-regular border-t border-b border-grey-20 text-grey-90",
        className,
        { "cursor-pointer hover:bg-grey-5": linkTo !== undefined }
      )}
      {...props}
      {...(linkTo && {
        onClick: () => {
          navigate(linkTo)
        },
      })}
    >
      {children}
      {actions && (
        <Table.Cell onClick={(e) => e.stopPropagation()} className="w-[32px]">
          <Actionables forceDropdown={forceDropdown} actions={actions} />
        </Table.Cell>
      )}
    </tr>
  )
)

export const TablePagination = ({
  className,
  title = "Elements",
  currentPage,
  pageCount,
  pageSize,
  count,
  offset,
  nextPage,
  prevPage,
  hasNext,
  hasPrev,
}: TablePaginationProps) => {
  const soothedOffset = count > 0 ? offset + 1 : 0
  const soothedPageCount = Math.max(1, pageCount)

  return (
    <div
      className={clsx(
        "flex w-full justify-between inter-small-regular text-grey-50 mt-14",
        className
      )}
    >
      <div>{`${soothedOffset} - ${pageSize} of ${count} ${title}`}</div>
      <div className="flex space-x-4">
        <div>{`${currentPage} of ${soothedPageCount}`}</div>
        <div className="flex space-x-4 items-center">
          <div
            className={clsx(
              { ["text-grey-30"]: !hasPrev },
              { ["cursor-pointer"]: hasPrev }
            )}
            onClick={() => prevPage()}
          >
            <ArrowLeftIcon />
          </div>
          <div
            className={clsx(
              { ["text-grey-30"]: !hasNext },
              { ["cursor-pointer"]: hasNext }
            )}
            onClick={() => nextPage()}
          >
            <ArrowRightIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
