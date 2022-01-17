import React from "react"
import { navigate } from "gatsby"
import clsx from "clsx"
import Actionables, { ActionType } from "../../molecules/actionables"
import FilteringOptions, { FilteringOptionProps } from "./filtering-option"
import TableSearch from "./table-search"

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  actions?: ActionType[]
  linkTo?: string
}

type TableCellProps = React.HTMLAttributes<HTMLTableCellElement> & {
  linkTo?: string
}

type TableProps = {
  filteringOptions?: FilteringOptionProps[]
  enableSearch?: boolean
  handleSearch?: (searchTerm: string) => void
} & React.HTMLAttributes<HTMLTableElement>

type TableElement<T> = React.ForwardRefExoticComponent<T> &
  React.RefAttributes<unknown>

type TableType = {
  Head: TableElement<React.HTMLAttributes<HTMLTableElement>>
  HeadRow: TableElement<React.HTMLAttributes<HTMLTableRowElement>>
  HeadCell: TableElement<React.HTMLAttributes<HTMLTableCellElement>>
  Body: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  Row: TableElement<TableRowProps>
  Cell: TableElement<TableCellProps>
} & TableElement<TableProps>

const Table: TableType = React.forwardRef(
  (
    {
      className,
      children,
      enableSearch,
      handleSearch,
      filteringOptions,
      ...props
    }: TableProps,
    ref
  ) => {
    if (enableSearch && !handleSearch) {
      throw new Error("Table cannot enable search without a search handler")
    }

    return (
      <div className="flex flex-col">
        <div className="w-full flex justify-between">
          {filteringOptions && (
            <div className="flex mb-2 self-end">
              {filteringOptions.map(fo => (
                <FilteringOptions {...fo} />
              ))}
            </div>
          )}
          <div className="flex">
            {enableSearch && <TableSearch onSearch={handleSearch} />}
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
)

Table.Head = React.forwardRef(
  (
    { className, children, ...props }: React.HTMLAttributes<HTMLTableElement>,
    ref
  ) => (
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
  )
)

Table.HeadRow = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>,
    ref
  ) => (
    <tr ref={ref} className={clsx(className)} {...props}>
      {children}
    </tr>
  )
)

Table.HeadCell = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableCellElement>,
    ref
  ) => (
    <th ref={ref} className={clsx("text-left py-2.5", className)} {...props}>
      {children}
    </th>
  )
)

Table.Body = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableSectionElement>,
    ref
  ) => (
    <tbody ref={ref} className={clsx(className)} {...props}>
      {children}
    </tbody>
  )
)

Table.Cell = React.forwardRef(
  ({ className, linkTo, children, ...props }: TableCellProps, ref) => (
    <td
      ref={ref}
      className={clsx("inter-small-regular", className)}
      {...props}
      {...(linkTo && {
        onClick: e => {
          navigate(linkTo)
          e.stopPropagation()
        },
      })}
    >
      <div className="w-inherit truncate">{children}</div>
    </td>
  )
)

Table.Row = React.forwardRef(
  ({ className, actions, children, linkTo, ...props }: TableRowProps, ref) => (
    <tr
      ref={ref}
      className={clsx(
        "inter-small-regular border-t border-b border-grey-20 text-grey-90 ",
        className,
        { "cursor-pointer": linkTo !== undefined }
      )}
      {...props}
      {...(linkTo && { onClick: () => navigate(linkTo) })}
    >
      {children}
      {actions && (
        <Table.Cell className="w-8">
          <Actionables actions={actions} />
        </Table.Cell>
      )}
    </tr>
  )
)

export default Table
