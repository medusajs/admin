import React, { useState, useRef, useCallback } from "react"
import styled from "@emotion/styled"
import { Text, Flex, Box } from "rebass"

const ENTER_KEY = 13
const TAB_KEY = 9
const ARROW_UP_KEY = 38
const ARROW_DOWN_KEY = 40

const Wrapper = styled.div`
  position: relative;
  overflow-x: scroll;
`

const StyledTable = styled(Box)`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  background-color: ${props => props.theme.colors.light};
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 4px;
  text-align: center;
  font-weight: normal;

  ${props =>
    props.head &&
    `
    background-color: transparent;
    border: none;
  `}
`

const DragHandle = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 5px;
  height: 5px;
  background-color: rgba(206, 208, 190, 1);
  border: 1px solid white;
`

const Td = styled.td`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 200px;

  padding: 8px;
  font-size: 14px;
  font-family: ${props => props.theme.fonts.body};

  ${props =>
    props.selected && `box-shadow: ${props.theme.grid.selectedShadow}`};

  ${props =>
    props.head &&
    `
    text-align:center;
    position: sticky;
    width: 50px;
    left: 0;
    top: auto;
    box-shadow: ${props => props.theme.grid.headColShadow};
  `}

  ${props =>
    props.dragover &&
    `
    background-color: rgba(206, 208, 190, 0.22);
  `}
`

const InputField = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  background-color: transparent;
  padding: 0;
  font-size: 14px;
  &:focus {
    outline: none;
  }
`

const VariantGrid = ({ variants, onChange }) => {
  const [dragEnd, setDragEnd] = useState()
  const [selectedCell, setSelectedCell] = useState({})

  const inputRef = useRef()
  const setRef = useCallback(node => {
    if (node) {
      node.focus()
    }

    inputRef.current = node
  }, [])

  const columns = [
    {
      header: "",
      field: "options",
      formatter: value => value.join(" / "),
      readOnly: true,
      headCol: true,
    },
    { header: "SKU", field: "sku" },
    { header: "Price", field: "price" },
  ]

  const handleChange = e => {
    const element = e.target
    const [index, field] = e.target.name.split(".")
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: element.value,
    }

    setSelectedCell({
      ...selectedCell,
      value: element.value,
    })
    onChange(newVariants)
  }

  const handleDragEnter = e => {
    const element = e.target
    if (selectedCell.col === parseInt(element.dataset.col)) {
      setDragEnd(parseInt(element.dataset.row))
    }
  }

  const handleDragEnd = () => {
    if (selectedCell.row === dragEnd) {
      return
    }

    const bounds = [selectedCell.row, dragEnd]
    const newVariants = [...variants]
    for (let i = Math.min(...bounds); i <= Math.max(...bounds); i++) {
      newVariants[i] = {
        ...newVariants[i],
        [selectedCell.field]: selectedCell.value,
      }
    }

    onChange(newVariants)
    setDragEnd(undefined)
  }

  const isDraggedOver = cell => {
    if (selectedCell.col === cell.col) {
      if (dragEnd > selectedCell.row) {
        return selectedCell.row < cell.row && cell.row <= dragEnd
      } else if (dragEnd < selectedCell.row) {
        return dragEnd <= cell.row && cell.row < selectedCell.row
      }
    }

    return false
  }

  const handleKey = e => {
    switch (e.keyCode) {
      case ENTER_KEY:
        if (e.shiftKey) {
          if (selectedCell.row > 0) {
            setSelectedCell({
              ...selectedCell,
              row: selectedCell.row - 1,
            })
          }
        } else {
          if (selectedCell.row < variants.length - 1) {
            setSelectedCell({
              ...selectedCell,
              row: selectedCell.row + 1,
            })
          }
        }
        break
      case ARROW_DOWN_KEY:
        if (selectedCell.row < variants.length - 1) {
          setSelectedCell({
            ...selectedCell,
            row: selectedCell.row + 1,
          })
        }
        break
      case ARROW_UP_KEY:
        if (selectedCell.row > 0) {
          setSelectedCell({
            ...selectedCell,
            row: selectedCell.row - 1,
          })
        }
        break
      case TAB_KEY:
        e.preventDefault()
        if (e.shiftKey) {
          if (selectedCell.col > 1) {
            setSelectedCell({
              ...selectedCell,
              col: selectedCell.col - 1,
            })
          }
        } else {
          if (selectedCell.col < columns.length - 1) {
            setSelectedCell({
              ...selectedCell,
              col: selectedCell.col + 1,
            })
          }
        }
        break
      default:
        break
    }
  }

  const getDisplayValue = (variant, column, isDragged) => {
    const { formatter, field } = column
    if (isDragged) {
      return formatter ? formatter(selectedCell.value) : selectedCell.value
    } else {
      return formatter ? formatter(variant[field]) : variant[field]
    }
  }

  return (
    <Wrapper>
      <StyledTable as="table">
        <thead>
          <tr>
            {columns.map(c => (
              <Th head={c.headCol} key={c.field}>
                {c.header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((v, row) => (
            <tr key={row}>
              {columns.map((c, col) => (
                <Td
                  key={`${row}-${col}`}
                  data-col={col}
                  data-row={row}
                  dragover={isDraggedOver({ col, row })}
                  onDragEnter={handleDragEnter}
                  onClick={() =>
                    !c.readOnly &&
                    setSelectedCell({
                      field: c.field,
                      value: v[c.field],
                      row,
                      col,
                    })
                  }
                  selected={
                    selectedCell.row === row && selectedCell.col === col
                  }
                  head={c.headCol}
                >
                  {!(selectedCell.row === row && selectedCell.col === col) &&
                    getDisplayValue(v, c, isDraggedOver({ col, row }))}
                  {selectedCell.row === row && selectedCell.col === col && (
                    <>
                      <InputField
                        ref={setRef}
                        onKeyDown={handleKey}
                        name={`${row}.${c.field}`}
                        value={v[c.field] || ""}
                        onChange={handleChange}
                      />
                      <DragHandle draggable onDragEnd={handleDragEnd} />
                    </>
                  )}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Wrapper>
  )
}

export default VariantGrid
