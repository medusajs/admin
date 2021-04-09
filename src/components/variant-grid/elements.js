import { Box } from "rebass"
import styled from "@emotion/styled"
import { TableDataCell } from "../table"

export const Wrapper = styled.div`
  padding: 1px;
`

export const StyledTable = styled(Box)`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  tr {
    border-bottom: 1px solid #e3e8ee;
  }

  td {
    border: none;
  }
`

export const Th = styled.th`
  background-color: ${props => props.theme.colors.light};
  padding: 2px;
  padding-left: 8px;
  font-size: 12px;
  font-weight: 500;
`

export const DragHandle = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 5px;
  height: 5px;
  background-color: rgba(206, 208, 190, 1);
  border: 1px solid white;
`

export const Td = styled(TableDataCell)`
  position: relative;
  min-width: 200px;

  font-size: 14px;
  font-family: ${props => props.theme.fonts.body};

  ${props =>
    props.selected && `box-shadow: ${props.theme.grid.selectedShadow}`};

  ${props =>
    props.head &&
    `
    min-width: 50px;
    text-align:center;
    position: sticky;
    width: 50px;
    left: 0;
    top: auto;
  `}

  ${props =>
    props.dragover &&
    `
    background-color: rgba(206, 208, 190, 0.22);
  `}
`

export const InputField = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  background-color: transparent;
  padding: 0;
  font-size: 14px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:focus {
    outline: none;
  }
`
