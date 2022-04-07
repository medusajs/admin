/* eslint-disable no-unused-vars */
export type DiscountFormType = {
  code: string
  usage_limit: string
  rule: {
    value: string
    description: string
  }
}

export enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export type DiscountConditionRecord = {
  products: string | null
  product_types: string | null
  product_collections: string | null
  product_tags: string | null
  customer_groups: string | null
}

export enum DiscountConditionOperator {
  IN = "in",
  NOT_IN = "not_in",
}

export type CreateConditionProps = {
  type: DiscountConditionType
  ids: string[]
}
