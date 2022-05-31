import {
  useAdminCreateVariant,
  useAdminDeleteVariant,
  useAdminUpdateVariant,
} from "medusa-react"
import React, { useState } from "react"
import VariantEditor from "../../domain/products/details/variants/variant-editor"
import { buildOptionsMap } from "../../domain/products/product-form/utils"
import useImperativeDialog from "../../hooks/use-imperative-dialog"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import DuplicateIcon from "../fundamentals/icons/duplicate-icon"
import EditIcon from "../fundamentals/icons/edit-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import GridInput from "../molecules/grid-input"
import Table from "../molecules/table"
import { useGridColumns } from "./use-grid-columns"

const VariantGrid = ({ product, variants, edit, onVariantsChange }) => {
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<{
    prices: any[]
    origin_country: string
    options: any[]
    [k: string]: any
  } | null>(null)

  const createVariant = useAdminCreateVariant(product?.id)
  const updateVariant = useAdminUpdateVariant(product?.id)
  const deleteVariant = useAdminDeleteVariant(product?.id)

  const notification = useNotification()
  const dialog = useImperativeDialog()

  const columns = useGridColumns(product, edit)

  const handleChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    }

    onVariantsChange(newVariants)
  }

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

  const handleDuplicateVariant = async (variant) => {
    createVariant.mutate(
      { ...variant },
      {
        onSuccess: () => {
          notification("Success", "Successfully created variant", "success")
          setSelectedVariant(null)
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const editVariantActions = (variant) => {
    return [
      {
        label: "Edit",
        icon: <EditIcon size={20} />,
        onClick: () => setSelectedVariant(variant),
      },
      {
        label: "Duplicate",
        icon: <DuplicateIcon size={20} />,
        onClick: () => {
          setSelectedVariant(variant)
          setIsDuplicate(true)
        },
      },
      {
        label: "Delete",
        icon: <TrashIcon size={20} />,
        onClick: () => handleDeleteVariant(variant),
        variant: "danger",
      },
    ]
  }

  return (
    <>
      <Table>
        <Table.Head>
          <Table.HeadRow>
            {columns.map((col) => (
              <Table.HeadCell className="w-[100px] px-2 py-4">
                {col.header}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {variants.map((variant, i) => {
            return (
              <Table.Row
                key={i}
                color={"inherit"}
                actions={edit && editVariantActions(variant)}
              >
                {columns.map((col, j) => {
                  return (
                    <Table.Cell key={j}>
                      {edit || col.readOnly ? (
                        <div className="px-2 py-4 truncate">
                          {getDisplayValue(variant, col)}
                        </div>
                      ) : (
                        <GridInput
                          key={j}
                          value={variant[col.field]}
                          onChange={({ currentTarget }) =>
                            handleChange(i, col.field, currentTarget.value)
                          }
                        />
                      )}
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
          onSubmit={isDuplicate ? handleDuplicateVariant : handleUpdateVariant}
          optionsMap={buildOptionsMap(product, selectedVariant)}
          title="Edit variant"
        />
      )}
    </>
  )
}

export default VariantGrid
