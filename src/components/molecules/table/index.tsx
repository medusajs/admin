import React from "react"
import { navigate } from "gatsby"
import clsx from "clsx"
import Actionables, { ActionType } from "../../molecules/actionables"

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  actions?: ActionType[]
  linkTo?: string
}

type TableElement<T> = React.ForwardRefExoticComponent<T> &
  React.RefAttributes<unknown>

type TableType = {
  Head: TableElement<React.HTMLAttributes<HTMLTableElement>>
  HeadRow: TableElement<React.HTMLAttributes<HTMLTableRowElement>>
  HeadCell: TableElement<React.HTMLAttributes<HTMLTableCellElement>>
  Body: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  Row: TableElement<TableRowProps>
  Cell: TableElement<React.HTMLAttributes<HTMLTableCellElement>>
} & TableElement<React.HTMLAttributes<HTMLTableElement>>

const Table: TableType = React.forwardRef(
  (
    { className, children, ...props }: React.HTMLAttributes<HTMLTableElement>,
    ref
  ) => (
    <table
      ref={ref}
      className={clsx("w-full table-auto", className)}
      {...props}
    >
      {children}
    </table>
  )
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
    <tr ref={ref} className={clsx("", className)} {...props}>
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
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
)

Table.Cell = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableCellElement>,
    ref
  ) => (
    <td
      ref={ref}
      className={clsx("overflow-hidden py-1.5 whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </td>
  )
)

Table.Row = React.forwardRef(
  ({ className, actions, children, linkTo, ...props }: TableRowProps, ref) => (
    <tr
      ref={ref}
      className={clsx(
        "inter-small-regular border-t border-b border-grey-20 text-grey-90",
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
