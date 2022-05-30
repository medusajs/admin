import { Discount } from "@medusajs/medusa"
import { useAdminDiscountRemoveCondition } from "medusa-react"
import React from "react"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { DiscountConditionType } from "../../types"

export const useDiscountConditions = (discount: Discount) => {
  const { mutate } = useAdminDiscountRemoveCondition(discount.id)
  const notification = useNotification()

  const removeCondition = (conditionId: string) => {
    mutate(conditionId, {
      onSuccess: () => {
        notification("Success", "Condition removed", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const itemized = discount.rule.conditions.map((condition) => ({
    type: condition.type,
    title: getTitle(condition.type),
    actions: [
      {
        label: "Delete condition",
        icon: <TrashIcon size={16} />,
        variant: "danger",
        onClick: () => removeCondition(condition.id),
      },
    ] as ActionType[],
  }))

  return itemized
}

const getTitle = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Product"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Collection"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Tag"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Type"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Customer Group"
  }
}
