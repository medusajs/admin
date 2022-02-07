import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAdminDeleteVariant, useAdminUpdateVariant } from "medusa-react"
import React, { useState } from "react"
import { Box } from "rebass"
import VariantEditor from "../../domain/products/details/variants/variant-editor"
import useToaster from "../../hooks/use-toaster"
import { getErrorMessage } from "../../utils/error-messages"
import Button from "../fundamentals/button"
import EditIcon from "../fundamentals/icons/edit-icon"
import MoreHorizontalIcon from "../fundamentals/icons/more-horizontal-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import DeletePrompt from "../organisms/delete-prompt"
import { TableHead, TableHeaderCell } from "../table"
import { StyledTable, Td, Wrapper } from "./elements"

const getColumns = (product, edit) => {
  const defaultFields = [
    { header: "Title", field: "title" },
    { header: "SKU", field: "sku" },
    { header: "EAN", field: "ean" },
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

const VariantGrid = ({ product, variants, edit }) => {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const updateVariant = useAdminUpdateVariant(product.id)
  const deleteVariant = useAdminDeleteVariant(product.id)
  const toaster = useToaster()

  const columns = getColumns(product, edit)

  const getDisplayValue = (variant, column) => {
    const { formatter, field } = column

    return formatter ? formatter(variant[field]) : variant[field]
  }

  const handleUpdateVariant = (data) => {
    updateVariant.mutate(
      { variant_id: selectedVariant?.id, ...data },
      {
        onSuccess: () => {
          toaster("Successfully update variant", "success")
          setSelectedVariant(null)
        },
        onError: (err) => {
          toaster(getErrorMessage(err), "error")
        },
      }
    )
  }

  const handleDeleteVariant = async () => {
    return deleteVariant.mutate(toDelete?.id)
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
                  head={c.headCol}
                >
                  {getDisplayValue(v, c)}
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
                    <DropdownMenu.Item className="mb-1 last:mb-0">
                      <Button
                        variant="ghost"
                        size="small"
                        className={"w-full justify-start text-rose-50"}
                        onClick={() => setToDelete(v)}
                      >
                        <TrashIcon />
                        Delete
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
          onSubmit={handleUpdateVariant}
        />
      )}
      {toDelete && (
        <DeletePrompt
          onDelete={handleDeleteVariant}
          handleClose={() => setToDelete(null)}
          successText="Successfully deleted variant"
        />
      )}
    </Wrapper>
  )
}

export default VariantGrid
