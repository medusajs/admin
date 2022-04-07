/* eslint-disable no-unused-vars */
import {
  AdminCreateCondition,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
  Discount,
  DiscountCondition,
} from "@medusajs/medusa"
import { FieldValues } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { DiscountConditionOperator, DiscountConditionRecord } from "../../types"

export interface DiscountFormValues extends FieldValues {
  id?: string
  code?: string
  rule_id?: string
  type: string
  value?: number
  allocation: string
  description: string
  starts_at: Date
  ends_at: Date | null
  usage_limit?: string
  is_dynamic: boolean
  valid_duration?: string
  regions: Option[] | null
}

export enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

const mapConditionsToFormValues = (conditions: DiscountCondition[]) => {
  const record: DiscountConditionRecord = {
    customer_groups: null,
    product_collections: null,
    product_tags: null,
    product_types: null,
    products: null,
  }

  for (const condition of conditions) {
    switch (condition.type) {
      case DiscountConditionType.PRODUCTS:
        record.products = {
          id: condition.id,
          items: [] as string[],
        }
        break
      case DiscountConditionType.PRODUCT_TYPES:
        record.product_types = {
          id: condition.id,
          items: [] as string[],
        }
        break
      case DiscountConditionType.PRODUCT_COLLECTIONS:
        record.product_collections = {
          id: condition.id,
          items: [] as string[],
        }
        break
      case DiscountConditionType.PRODUCT_TAGS:
        record.product_tags = {
          id: condition.id,
          items: [] as string[],
        }
        break
      case DiscountConditionType.CUSTOMER_GROUPS:
        record.customer_groups = {
          id: condition.id,
          items: [] as string[],
        }
        break
    }
  }

  return record
}

export const discountToFormValuesMapper = (
  discount: Discount
): DiscountFormValues => {
  return {
    id: discount.id,
    code: discount.code,
    rule_id: discount.rule.id,
    type: discount.rule.type,
    rule: {
      value: discount.rule.value,
      conditions: mapConditionsToFormValues(discount.rule.conditions),
    },
    allocation: discount.rule.allocation,
    description: discount.rule.description,
    starts_at: new Date(discount.starts_at),
    ends_at: discount.ends_at ? new Date(discount.ends_at) : null,
    is_dynamic: discount.is_dynamic,
    usage_limit: `${discount.usage_limit}`,
    valid_duration: discount.valid_duration,
    regions: discount.regions
      ? discount.regions.map((r) => ({ label: r.name, value: r.id }))
      : null,
  }
}

export const formValuesToCreateDiscountMapper = (
  values: DiscountFormValues
): Omit<AdminPostDiscountsReq, "is_disabled"> => {
  console.log(values)
  return {
    code: values.code!,
    rule: {
      allocation: values.allocation,
      type: values.type,
      value:
        values.type !== "free_shipping"
          ? parseInt((values.rule.value! as unknown) as string, 10)
          : 0,
      description: values.description,
      conditions: mapCreateConditions(values.conditions),
    },
    is_dynamic: values.is_dynamic,
    ends_at: values.ends_at ?? undefined,
    regions: values.regions?.map((r) => r.value),
    starts_at: values.starts_at,
    usage_limit: parseFloat((values.usage_limit as unknown) as string),
    valid_duration:
      values.is_dynamic && values.valid_duration?.length
        ? values.valid_duration
        : undefined,
  }
}

export const formValuesToUpdateDiscountMapper = (
  values: DiscountFormValues
): AdminPostDiscountsDiscountReq => {
  return {
    code: values.code,
    rule: {
      allocation: values.allocation,
      id: values.rule_id!,
      type: values.type,
      value: parseInt((values.rule.value as unknown) as string, 10),
      description: values.description,
    },
    ends_at: values.ends_at ?? undefined,
    regions: values.regions?.map((r) => r.value),
    starts_at: values.starts_at,
    usage_limit: parseInt((values.usage_limit as unknown) as string, 10),
    valid_duration: values.valid_duration?.length
      ? values.valid_duration
      : undefined,
  }
}

const mapCreateConditions = (
  record: DiscountConditionRecord
): AdminCreateCondition[] => {
  const conditions: AdminCreateCondition[] = []

  for (const [key, value] of Object.entries(record)) {
    if (value) {
      conditions.push({
        operator: DiscountConditionOperator.IN,
        [key]: value.items,
      })
    }
  }

  return conditions
}
