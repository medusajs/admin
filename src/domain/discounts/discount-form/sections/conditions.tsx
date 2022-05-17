import React from "react"
import NumberedItem from "../../../../components/molecules/numbered-item"
import { removeNullish } from "../../../../utils/remove-nullish"
import { useDiscountForm } from "../form/discount-form-context"
import { DiscountConditionType } from "../form/mappers"
import ConditionItem from "./condition-item"
import useConditionActions from "./use-condition-actions"
type ConditionsProps = {
  discountId: string
  isEdit?: boolean
}

const Conditions: React.FC<ConditionsProps> = ({
  discountId,
  isEdit = false,
}) => {
  const { conditions } = useDiscountForm()

  const cleanConditions = removeNullish(conditions)

  const { getActions } = useConditionActions()

  console.log(discountId)
  return (
    <div className="pt-6 flex flex-col gap-y-small">
      {Object.keys(cleanConditions).map((key, i) => {
        return (
          <div>
            {discountId ? (
              <ConditionItem
                index={i}
                discountId={discountId}
                conditionId={cleanConditions[key].id}
                type={key as DiscountConditionType}
              />
            ) : (
              <NumberedItem
                index={i + 1}
                title={getTitle(key as DiscountConditionType)}
                description={getDescription(key as DiscountConditionType)}
                actions={getActions(key)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const getTitle = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Product"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Collection"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Tag"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Customer group"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Type"
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
