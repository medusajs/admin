import React from "react"
import clsx from "clsx"

export const Table = React.forwardRef(
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

export const TableHead = React.forwardRef(
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

export const TableBody = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>,
    ref
  ) => (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
)

export const TableRow = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>,
    ref
  ) => (
    <tr
      ref={ref}
      className={clsx(
        "inter-small-regular border-t border-b border-grey-20 text-grey-90",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
)

export const TableHeaderRow = React.forwardRef(
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

export const TableHeaderCell = React.forwardRef(
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

export const TableDataCell = React.forwardRef(
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
      className={clsx("overflow-hidden  py-1.5 whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </td>
    // <Box
    //   ref={ref}
    //   as="td"
    //   variant="td"
    //   {...props}
    //   height="100%"
    //   width="100%"
    //   maxWidth={props.maxWidth ? props.maxWidth : "100%"}
    //   sx={{
    //     ...props.sx,
    //     whiteSpace: "nowrap",
    //     overflow: "hidden",
    //     textOverflow: "ellipsis",
    //   }}
    // />
  )
)
