import React from "react"
import NumberedItem from "../../../../components/molecules/numbered-item"
import { removeNullish } from "../../../../utils/remove-nullish"
import { useDiscountForm } from "../form/discount-form-context"
import { DiscountConditionType } from "../form/mappers"
import useConditionActions from "./use-condition-actions"

const Conditions: React.FC = () => {
  const { conditions } = useDiscountForm()

  const cleanConditions = removeNullish(conditions)

  const { getActions } = useConditionActions()
  return (
    <div className="pt-6 flex flex-col gap-y-small">
      {Object.keys(cleanConditions).map((key, i) => {
        return (
          conditions[key] && (
            <NumberedItem
              index={i + 1}
              title={getTitle(key as DiscountConditionType)}
              description={getDescription(key as DiscountConditionType)}
              actions={getActions(key)}
            />
          )
        )
      })}
    </div>
  )
}

const getTitle = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Products"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Product collections"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Product tags"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Customer groups"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Product types"
  }
}

const getDescription = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "This promotion applies to selected products"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "This promotion applies to selected product collections"
    case DiscountConditionType.PRODUCT_TAGS:
      return "This promotion applies to selected product tags"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "This promotion applies to selected customer groups"
    case DiscountConditionType.PRODUCT_TYPES:
      return "This promotion applies to selected product types"
  }
}

export default Conditions
