import { useAdminGetDiscountCondition } from "medusa-react"
import React, { useEffect, useMemo, useRef } from "react"
import NumberedItem from "../../../../../components/molecules/numbered-item"
import { useObserveWidth } from "../../../../../hooks/use-observe-width"
import { ConditionMap, DiscountConditionType } from "../../../types"

type ConditionItemProps<Type extends DiscountConditionType> = {
  index: number
  discountId?: string
  conditionId?: string
  type: Type
  updateCondition: React.Dispatch<React.SetStateAction<ConditionMap>>
  items: { id: string; label: string }[]
}

const ConditionItem = <Type extends DiscountConditionType>({
  index,
  discountId,
  conditionId,
  type,
  updateCondition,
  items,
}: ConditionItemProps<Type>) => {
  const queryParams = useMemo(() => {
    switch (type) {
      case DiscountConditionType.PRODUCTS:
        return { expand: "products" }
      case DiscountConditionType.PRODUCT_COLLECTIONS:
        return { expand: "product_collections" }
      case DiscountConditionType.PRODUCT_TAGS:
        return { expand: "product_tags" }
      case DiscountConditionType.CUSTOMER_GROUPS:
        return { expand: "customer_groups" }
      case DiscountConditionType.PRODUCT_TYPES:
        return { expand: "product_types" }
    }
  }, [type])

  const { discount_condition } = useAdminGetDiscountCondition(
    discountId!,
    conditionId!,
    queryParams,
    {
      enabled: !!discountId && !!conditionId,
    }
  )

  useEffect(() => {
    if (!discount_condition) {
      return
    }

    switch (type) {
      case DiscountConditionType.PRODUCTS:
        updateCondition((prevConditions) => {
          return {
            ...prevConditions,
            products: {
              ...prevConditions.products,
              id: discount_condition.id,
              operator: discount_condition.operator,
              items: discount_condition.products.map((p) => ({
                id: p.id,
                label: p.title,
              })),
            },
          }
        })
    }
  }, [discount_condition, type])

  const containerRef = useRef<HTMLDivElement>(null)
  const width = useObserveWidth(containerRef)
  const [visibleItems, remainder] = getVisibleItems(items, width)

  // If no items in the list, don't render anything
  if (!items.length) {
    return null
  }

  const description = (
    <div
      ref={containerRef}
      className="w-full flex items-center inter-small-regular gap-x-xsmall flex-1"
    >
      <div className="gap-x-2xsmall text-grey-50">
        {visibleItems.map((item, i) => {
          return (
            <span key={i}>
              {type === DiscountConditionType.PRODUCT_TAGS && "#"}
              {item.label}
              {i !== visibleItems.length - 1 && ", "}
            </span>
          )
        })}
      </div>
      {remainder > 0 && <span className="text-grey-40">+{remainder} more</span>}
    </div>
  )

  return (
    <div>
      <NumberedItem
        index={index + 1}
        title={getTitle(type)}
        description={description}
        actions={[
          {
            label: "Edit",
            onClick: () => {},
          },
        ]}
      />
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

const getVisibleItems = <T extends unknown>(
  items: T[],
  width: number
): [T[], number] => {
  const columns = Math.max(Math.floor(width / 85) - 1, 1)
  const visibleItems = items.slice(0, columns)
  const remainder = items.length - columns

  return [visibleItems, remainder]
}

export default ConditionItem
