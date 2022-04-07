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

type ConditionPayload = {
  id?: string
  items?: string[]
}

export type DiscountConditionRecord = {
  products: ConditionPayload | null
  product_types: ConditionPayload | null
  product_collections: ConditionPayload | null
  product_tags: ConditionPayload | null
  customer_groups: ConditionPayload | null
}

export enum DiscountConditionOperator {
  IN = "in",
  NOT_IN = "not_in",
}

export type CreateConditionProps = {
  type: DiscountConditionType
  ids: string[]
}
