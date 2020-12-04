import React from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"

const StyledTable = styled(Box)`
  // box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
  //   0 1px 3px 0 rgba(63, 63, 68, 0.15);
`

const StyledTableRow = styled(Flex)`
  position: relative;
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    height: 100%;
    background-color: ${props =>
      props.isHighlighted ? "#454545" : "transparent"};
  }
  td:nth-of-type(1) {
    padding-left: 15px;
  }
  th:nth-of-type(1) {
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
      width: "100%",
      position: "relative",
      fontSize: "12px",
      emptyCells: "show",
    }}
  />
))

export const TableHead = React.forwardRef((props, ref) => (
  <Box
    ref={ref}
    as="thead"
    variant="thead"
    {...props}
    sx={{
      whiteSpace: "nowrap",
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
      whiteSpace: "nowrap",
    }}
  />
))

export const TableRow = React.forwardRef((props, ref) => (
  <StyledTableRow
    tabIndex="1"
    ref={ref}
    as="tr"
    variant="tr"
    sx={{
      top: 0,
      cursor: "pointer",
      height: "55px",
    }}
    {...props}
  />
))

export const TableHeaderRow = React.forwardRef((props, ref) => (
  <StyledTableRow
    ref={ref}
    as="tr"
    variant="tr"
    p={0}
    {...props}
    sx={{
      background: "white",
    }}
  />
))

export const TableHeaderCell = React.forwardRef((props, ref) => (
  <Box
    ref={ref}
    as="th"
    variant="th"
    height="30px"
    lineHeight="30px"
    p={0}
    px={3}
    width="100%"
    color={"dark"}
    fontSize={0}
    sx={{
      textTransform: "uppercase",
      ...props.sx,
    }}
    {...props}
  />
))

export const TableDataCell = React.forwardRef((props, ref) => (
  <Box
    ref={ref}
    as="td"
    variant="td"
    {...props}
    height="100%"
    width="100%"
    maxWidth={props.maxWidth ? props.maxWidth : "100%"}
    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
  />
))
