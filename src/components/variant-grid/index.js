import React, { useState, useRef, useCallback } from "react"
import { Text, Flex, Box } from "rebass"

import GridEditor from "./editors"
import DefaultEditor from "./editors/default"
import OptionEditor from "./editors/option"
import { ReactComponent as EditIcon } from "../../assets/svg/edit-pencil.svg"
import { ReactComponent as ClipboardIcon } from "../../assets/svg/clipboard.svg"

import Button from "../button"

import {
  Th,
  Td,
  Wrapper,
  StyledTable,
  DragHandle,
  InputField,
} from "./elements"
import { TableDataCell, TableHead, TableHeaderCell } from "../table"
import Dropdown from "../dropdown"

const ENTER_KEY = 13
const TAB_KEY = 9
const ARROW_UP_KEY = 38
const ARROW_DOWN_KEY = 40

const getColumns = (product, edit) => {
  const defaultFields = [
    { header: "TITLE", field: "title" },
    { header: "SKU", field: "sku" },
    { header: "EAN", field: "ean" },
    { header: "INVENTORY", field: "inventory_quantity" },
  ]

  if (edit) {
    const optionColumns = product.options.map(o => ({
      header: o.title,
      field: "options",
      editor: "option",
      option_id: o.id,
      formatter: variantOptions => {
        return (variantOptions.find(val => val.option_id === o.id) || {}).value
      },
    }))

    return [
      ...optionColumns,
      {
        header: "PRICES",
        field: "prices",
        editor: "prices",
        buttonText: "Edit",
        formatter: prices => {
          return `${prices.length} price(s)`
          // return prices
          //   .map(
          //     ({ currency_code, amount }) =>
          //       `${(amount / 100).toFixed(2)} ${currency_code.toUpperCase()}`
          //   )
          //   .join(", ")
        },
      },
      ...defaultFields,
    ]
  } else {
    return [
      {
        header: "",
        field: "options",
        formatter: value => {
          const options = value.map(v => {
            if (v.value) {
              return v.value
            }
            return v
          })

          return options.join(" / ")
        },
        readOnly: true,
        headCol: true,
      },
      ...defaultFields,
      {
        header: "PRICES",
        field: "prices",
        editor: "prices",
        buttonText: "Edit",
        formatter: prices => {
          if (!prices) {
            return ""
          }
          return `${prices.length} price(s)`
          // return prices
          //   .map(
          //     ({ currency_code, amount }) =>
          //       `${amount / 100} ${currency_code.toUpperCase()}`
          //   )
          //   .join(", ")
        },
      },
    ]
  }
}

const VariantGrid = ({ product, variants, onChange, edit, onEdit, onCopy }) => {
  const [dragEnd, setDragEnd] = useState()
  const [selectedCell, setSelectedCell] = useState({})

  const columns = getColumns(product, edit)

  const inputRef = useRef()
  const setRef = useCallback(node => {
    if (node) {
      node.focus()
    }

    inputRef.current = node
  }, [])

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

  const handleChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    }

    onChange(newVariants)
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
        e.preventDefault()
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
          if (selectedCell.col > (edit ? 0 : 1)) {
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
        <TableHead>
          <tr>
            {columns.map(c => (
              <TableHeaderCell head={c.headCol} key={c.field}>
                {c.header}
              </TableHeaderCell>
            ))}
            <TableHeaderCell width="100px" />
          </tr>
        </TableHead>
        <tbody>
          {variants.map(
            (v, row) =>
              (v.id !== undefined || !product) && (
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
                      {!(
                        selectedCell.row === row && selectedCell.col === col
                      ) && getDisplayValue(v, c, isDraggedOver({ col, row }))}
                      {selectedCell.row === row && selectedCell.col === col && (
                        <>
                          <GridEditor
                            ref={setRef}
                            column={c}
                            index={row}
                            value={v[c.field]}
                            onKeyDown={handleKey}
                            onChange={handleChange}
                          />
                          <DragHandle draggable onDragEnd={handleDragEnd} />
                        </>
                      )}
                    </Td>
                  ))}
                  {onEdit ? (
                    <Box
                      as="td"
                      sx={{
                        padding: "4px",
                        borderBottom: "1px solid rgba(0,0,0,0.2)",
                        backgroundColor: "white",
                        // position: "sticky !important",
                        right: 0,
                      }}
                    >
                      <Dropdown
                        minHeight="24px"
                        dropdownWidth="120px"
                        width="28px"
                        sx={{
                          height: 0,
                          padding: 0,
                          margin: "auto 0 auto auto",
                        }}
                      >
                        <Flex
                          sx={{ padding: "8px 12px !important" }}
                          alignItems="center"
                          onClick={() => onEdit(row)}
                        >
                          <EditIcon />
                          <Text ml={1} fontSize={14}>
                            Edit
                          </Text>
                        </Flex>
                        <Flex
                          sx={{ padding: "8px 12px !important" }}
                          alignItems="center"
                          onClick={() => onCopy(row)}
                        >
                          <ClipboardIcon />
                          <Text ml={1} fontSize={14}>
                            Copy
                          </Text>
                        </Flex>
                      </Dropdown>
                    </Box>
                  ) : (
                    <Box
                      as="td"
                      height="24px"
                      sx={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
                    />
                  )}
                </tr>
              )
          )}
        </tbody>
      </StyledTable>
    </Wrapper>
  )
}

export default VariantGrid
