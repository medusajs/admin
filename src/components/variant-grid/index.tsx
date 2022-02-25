import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAdminDeleteVariant, useAdminUpdateVariant } from "medusa-react"
import React, { useState } from "react"
import VariantEditor from "../../domain/products/details/variants/variant-editor"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import Button from "../fundamentals/button"
import EditIcon from "../fundamentals/icons/edit-icon"
import MoreHorizontalIcon from "../fundamentals/icons/more-horizontal-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import DeletePrompt from "../organisms/delete-prompt"

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
  const notification = useNotification()

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
          notification("Success", "Successfully update variant", "success")
          setSelectedVariant(null)
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const handleDeleteVariant = async () => {
    return deleteVariant.mutate(toDelete?.id)
  }

  return (
    <div>
      <table className="w-full border-collapse table-fixed">
        <tr className="border-b border-t border-grey-20">
          {columns.map((c) => (
            <th
              key={c.field}
              className="text-left py-4 inter-small-semibold text-grey-50"
            >
              {c.header}
            </th>
          ))}
          <th className="w-[100px]" />
        </tr>
        <tbody>
          {variants.map((v, row) => (
            <tr
              key={row}
              className="inter-small-regular border-t border-b border-grey-20 text-grey-90"
            >
              {columns.map((c, col) => (
                <td
                  key={`${row}-${col}`}
                  data-col={col}
                  data-row={row}
                  className="relative min-w-[50px] text-left py-4"
                >
                  {getDisplayValue(v, c)}
                </td>
              ))}
              <td className="p-1 border-b border-grey-20">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  )
}

export default VariantGrid
