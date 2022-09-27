import { Order } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { FieldArrayWithId, useFieldArray, useWatch } from "react-hook-form"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { FormImage, Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import ReturnItemField from "./return-item"

type ReturnReasonDetails = {
  note?: string
  reason?: Option
  images?: FormImage[]
}

export type ReturnItem = {
  item_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  quantity: number
  refundable?: number | null
  return_reason_details: ReturnReasonDetails
  return: boolean
}

export type ItemsToReturnFormType = {
  items: ReturnItem[]
}

export type ReturnItemObject = FieldArrayWithId<
  {
    __nested__: ItemsToReturnFormType
  },
  "__nested__.items",
  "fieldId"
>

type Props = {
  form: NestedForm<ItemsToReturnFormType>
  order: Order
  isClaim?: boolean
}

const ItemsToReturnForm = ({ form, order, isClaim = false }: Props) => {
  const { control, path } = form

  const { fields } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
    shouldUnregister: true,
  })

  const watchedReturnItems = useWatch({
    control,
    name: path("items"),
  })

  const areAllSelected = useMemo(() => {
    return watchedReturnItems.every((item) => item.return)
  }, [watchedReturnItems])

  const indeterminateAllSelected = useMemo(() => {
    return (
      watchedReturnItems.some((item) => item.return) &&
      !watchedReturnItems.every((item) => item.return)
    )
  }, [watchedReturnItems])

  const toggleSelectAllRows = () => {
    fields.forEach((_item, index) => {
      form.setValue(path(`items.${index}.return`), !areAllSelected)
    })
  }

  return (
    <div className="flex flex-col gap-y-base">
      <h2 className="inter-base-semibold">Items to return</h2>
      <div>
        <div className="flex items-center inter-small-semibold text-grey-50 border-t border-grey-20 h-10">
          <div className="pl-base pr-large">
            <IndeterminateCheckbox
              checked={areAllSelected}
              indeterminate={indeterminateAllSelected}
              onChange={toggleSelectAllRows}
            />
          </div>
          <div className="flex-1">
            <p>Product</p>
          </div>
          <div className="ml-small mr-5xlarge">
            <p className="text-right">Quantity</p>
          </div>
          <div className="mr-small">
            <p className="text-right">Refundable</p>
          </div>
          <div className="min-w-[50px]" />
        </div>
        <div>
          {fields.map((field, index) => {
            return (
              <ReturnItemField
                form={form}
                key={field.fieldId}
                nestedItem={field}
                order={order}
                index={index}
                isClaim={isClaim}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ItemsToReturnForm
