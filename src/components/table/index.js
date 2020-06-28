import React from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"

const StyledTable = styled(Box)`
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
`

const StyledTableRow = styled(Flex)`
  td:nth-child(1) {
    padding-left: 15px;
  }
  th:nth-child(1) {
    padding-left: 15px;
  }
`

export const Table = React.forwardRef((props, ref) => (
  <StyledTable
    ref={ref}
    as="table"
    variant="table"
    {...props}
    sx={{
      fontSize: "12px",
      display: "block",
      height: "800px",
    }}
  />
))

export const TableBody = React.forwardRef((props, ref) => (
  <Box
    ref={ref}
    as="tbody"
    variant="tbody"
    {...props}
    sx={{
      display: "block",
      overflowY: "scroll",
      overflowX: "scroll",
      whiteSpace: "nowrap",
      height: "800px",
    }}
  />
))

export const TableRow = React.forwardRef((props, ref) => (
  <StyledTableRow
    ref={ref}
    as="tr"
    variant="tr"
    {...props}
    sx={{
      display: "block",
    }}
  />
))

export const TableHeaderRow = React.forwardRef((props, ref) => (
  <StyledTableRow
    ref={ref}
    as="th"
    variant="th"
    p={0}
    {...props}
    sx={{
      top: 0,
      display: "block",
      position: "sticky",
      background: "white",
    }}
  />
))

export const TableDataCell = React.forwardRef((props, ref) => (
  <Box ref={ref} as="td" variant="td" {...props} sx={{}} width={1 / 6} />
))
