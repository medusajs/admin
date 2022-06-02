import { Product, ProductVariant } from "@medusajs/medusa"
import {
  useAdminCreateVariant,
  useAdminDeleteVariant,
  useAdminUpdateVariant,
} from "medusa-react"
import React, { useState } from "react"
import DuplicateIcon from "../../../../../../components/fundamentals/icons/duplicate-icon"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../../../components/molecules/actionables"
import Table from "../../../../../../components/molecules/table"
import useImperativeDialog from "../../../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../../utils/error-messages"
import { Column, useEditColumns } from "./use-edit-columns"

type EditVariantsProps = {
  product: Product
}

const EditVariants = ({ product }: EditVariantsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  )
  const [isDuplicate, setIsDuplicate] = useState(false)

  const { mutate: duplicate } = useAdminCreateVariant(product.id)
  const { mutate: update } = useAdminUpdateVariant(product.id)
  const { mutate: remove } = useAdminDeleteVariant(product.id)

  const dialog = useImperativeDialog()
  const notification = useNotification()

  const handleDelete = async (variant: ProductVariant) => {
    const shouldDelete = await dialog({
      heading: "Delete product variant",
      text: "Are you sure?",
    })

    if (shouldDelete) {
      return remove(variant.id, {
        onSuccess: () => {
          notification("Success", "Successfully deleted variant", "success")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const handleDuplicate = (variant: ProductVariant) => {
    duplicate(
      {
        ...variant,
        prices: variant.prices.map((price) => ({
          amount: price.amount,
          currency_code: price.currency_code,
        })),
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully duplicated variant", "success")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const editVariantActions = (variant: ProductVariant) => {
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
        onClick: () => handleDelete(variant),
        variant: "danger",
      },
    ] as ActionType[]
  }

  const columns = useEditColumns(product)

  const getDisplayValue = (variant: ProductVariant, column: Column) => {
    const { formatter, field } = column
    return formatter ? formatter(variant[field]) : variant[field]
  }

  return (
    <Table>
      <Table.Head>
        <Table.HeadRow>
          {columns.map((col, i) => (
            <Table.HeadCell key={i} className="w-[100px] px-2 py-4">
              {col.header}
            </Table.HeadCell>
          ))}
        </Table.HeadRow>
      </Table.Head>
      <Table.Body>
        {product.variants.map((variant, j) => {
          return (
            <Table.Row
              key={j}
              color={"inherit"}
              actions={editVariantActions(variant)}
            >
              {columns.map((col, n) => {
                return (
                  <Table.Cell key={n}>
                    <div className="px-2 py-4 truncate">
                      {getDisplayValue(variant, col)}
                    </div>
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default EditVariants
