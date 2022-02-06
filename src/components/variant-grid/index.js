import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React, { useCallback, useRef, useState } from "react"
import { Box } from "rebass"
import VariantEditor from "../../domain/products/details/variants/variant-editor"
import Button from "../fundamentals/button"
import EditIcon from "../fundamentals/icons/edit-icon"
import MoreHorizontalIcon from "../fundamentals/icons/more-horizontal-icon"
import { TableHead, TableHeaderCell } from "../table"
import { StyledTable, Td, Wrapper } from "./elements"

const ENTER_KEY = 13
const TAB_KEY = 9
const ARROW_UP_KEY = 38
const ARROW_DOWN_KEY = 40

const getColumns = (product, edit) => {
  const defaultFields = [
    { header: "Title", field: "title" },
    { header: "Sku", field: "sku" },
    { header: "Ean", field: "ean" },
    { header: "Inventory", field: "inventory_quantity" },
  ]

  if (edit) {
    const optionColumns = product.options.map((o) => ({
      header: o.title,
      field: "options",
      editor: "option",
      option_id: o.id,
      formatter: (variantOptions) => {
        return (variantOptions.find((val) => val.option_id === o.id) || {})
          .value
      },
    }))

    return [
      ...optionColumns,
      {
        header: "Prices",
        field: "prices",
        editor: "prices",
        buttonText: "Edit",
        formatter: (prices) => {
          return `${prices.length} price(s)`
        },
      },
      ...defaultFields,
    ]
  } else {
    return [
      {
        header: "",
        field: "options",
        formatter: (value) => {
          const options = value.map((v) => {
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
        header: "Prices",
        field: "prices",
        editor: "prices",
        buttonText: "Edit",
        formatter: (prices) => {
          if (!prices) {
            return ""
          }
          return `${prices.length} price(s)`
        },
      },
    ]
  }
}

const VariantGrid = ({ product, variants, onChange, edit, onEdit, onCopy }) => {
  const [dragEnd, setDragEnd] = useState()
  const [selectedCell, setSelectedCell] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null)

  const columns = getColumns(product, edit)

  const inputRef = useRef()
  const setRef = useCallback((node) => {
    if (node) {
      node.focus()
    }

    inputRef.current = node
  }, [])

  const handleDragEnter = (e) => {
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

  const isDraggedOver = (cell) => {
    if (selectedCell.col === cell.col) {
      if (dragEnd > selectedCell.row) {
        return selectedCell.row < cell.row && cell.row <= dragEnd
      } else if (dragEnd < selectedCell.row) {
        return dragEnd <= cell.row && cell.row < selectedCell.row
      }
    }

    return false
  }

  const handleKey = (e) => {
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
            {columns.map((c) => (
              <TableHeaderCell head={c.headCol} key={c.field}>
                {c.header}
              </TableHeaderCell>
            ))}
            <TableHeaderCell width="100px" />
          </tr>
        </TableHead>
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
                  selected={
                    selectedCell.row === row && selectedCell.col === col
                  }
                  head={c.headCol}
                >
                  {getDisplayValue(v, c, isDraggedOver({ col, row }))}
                </Td>
              ))}
              <Box
                as="td"
                sx={{
                  padding: "4px",
                  borderBottom: "1px solid rgba(0,0,0,0.2)",
                  backgroundColor: "white",
                  textAlign: "right",
                }}
              >
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <div className="flex min-h-[40px] items-center justify-end cursor-pointer">
                      <MoreHorizontalIcon size={20} />
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    sideOffset={5}
                    className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
                  >
                    <DropdownMenu.Item className="mb-1 last:mb-0">
                      <Button
                        variant="ghost"
                        size="small"
                        className={"w-full justify-start"}
                        onClick={() => setSelectedVariant(v)}
                      >
                        <EditIcon />
                        Edit
                      </Button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Box>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {selectedVariant && (
        <VariantEditor
          variant={selectedVariant}
          onCancel={() => setSelectedVariant(null)}
          onSubmit={() => console.log("hello")}
        />
      )}
    </Wrapper>
  )
}

export default VariantGrid
