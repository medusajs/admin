import { useAdminGetDiscountCondition } from "medusa-react"
import React, { useMemo, useRef } from "react"
import NumberedItem from "../../../../components/molecules/numbered-item"
import { useObserveWidth } from "../../../../hooks/use-observe-width"
import { DiscountConditionType } from "../../types"

type ConditionItemProps = {
  index: number
  discountId: string
  conditionId: string
  type: DiscountConditionType
}

const ConditionItem: React.FC<ConditionItemProps> = ({
  index,
  discountId,
  conditionId,
  type,
}) => {
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
    discountId,
    conditionId,
    queryParams,
    {
      enabled: !!discountId,
    }
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const width = useObserveWidth(containerRef)

  const description = useMemo(() => {
    if (!discount_condition) {
      return getDescription(type)
    }

    if (discount_condition.products?.length) {
      const [items, remainder] = getVisibleItems(
        discount_condition.products,
        width
      )
      return (
        <div
          ref={containerRef}
          className="w-full flex items-center inter-small-regular gap-x-xsmall"
        >
          <div className="gap-x-2xsmall text-grey-50">
            {items.map((item, i) => {
              return (
                <span key={i}>
                  {item.title}
                  {i !== items.length - 1 && ", "}
                </span>
              )
            })}
          </div>
          {remainder > 0 && (
            <span className="text-grey-40">+{remainder} more</span>
          )}
        </div>
      )
    }

    return getDescription(type)
  }, [discount_condition, type, width])

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

const getVisibleItems = <T extends unknown>(
  items: T[],
  width: number
): [T[], number] => {
  console.log(width)
  const columns = Math.max(Math.floor(width / 110) - 1, 1)
  const visibleItems = items.slice(0, columns)
  const remainder = items.length - columns

  return [visibleItems, remainder]
}

export default ConditionItem
