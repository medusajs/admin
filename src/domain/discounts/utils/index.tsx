import { DiscountConditionType } from "@medusajs/medusa"

export const getTitle = (view: DiscountConditionType) => {
  switch (view) {
    case DiscountConditionType.PRODUCTS:
      return "products"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "groups"
    case DiscountConditionType.PRODUCT_TAGS:
      return "tags"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "collections"
    case DiscountConditionType.PRODUCT_TYPES:
      return "types"
  }
}
