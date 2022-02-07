import { useAdminDeleteVariant, useAdminUpdateVariant } from "medusa-react"
import React, { useState } from "react"
import VariantEditor from "../../domain/products/details/variants/variant-editor"
import useNotification from "../../hooks/use-notification"
import useImperativeDialog from "../../hooks/use-imperative-dialog"
import { getErrorMessage } from "../../utils/error-messages"
import EditIcon from "../fundamentals/icons/edit-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import Table from "../molecules/table"
import { Wrapper } from "./elements"

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
        header: "Variant",
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
    ]
  }
}

const VariantGrid = ({ product, variants, edit }) => {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const updateVariant = useAdminUpdateVariant(product.id)
  const deleteVariant = useAdminDeleteVariant(product.id)
  const notification = useNotification()

  const dialog = useImperativeDialog()

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

  const handleDeleteVariant = async (variant) => {
    const shouldDelete = await dialog({
      heading: "Delete product variant",
      text: "Are you sure?",
    })

    if (shouldDelete) {
      return deleteVariant.mutate(variant.id)
    }
  }

  const editVariantActions = (variant) => {
    return [
      {
        label: "Edit",
        icon: <EditIcon />,
        onClick: () => setSelectedVariant(variant),
      },
      {
        label: "Delete",
        icon: <TrashIcon />,
        onClick: () => handleDeleteVariant(variant),
        variant: "danger",
      },
    ]
  }

  return (
    <Wrapper>
      <Table>
        <Table.Head>
          <Table.HeadRow>
            {columns.map((col) => (
              <Table.HeadCell className="w-[100px]">
                {col.header}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {variants.map((variant, index) => {
            return (
              <Table.Row
                color={"inherit"}
                key={index}
                actions={edit && editVariantActions(variant)}
                className="hover:bg-grey-0"
              >
                {columns.map((col, index) => {
                  return (
                    <Table.Cell key={index}>
                      {getDisplayValue(variant, col)}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      {selectedVariant && (
        <VariantEditor
          variant={selectedVariant}
          onCancel={() => setSelectedVariant(null)}
          onSubmit={handleUpdateVariant}
        />
      )}
    </Wrapper>
  )
}

export default VariantGrid
