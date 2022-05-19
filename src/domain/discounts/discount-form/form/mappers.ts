/* eslint-disable no-unused-vars */
import {
  AdminCreateCondition,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
  AdminUpsertCondition,
  Discount,
} from "@medusajs/medusa"
import { FieldValues } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { ConditionMap, DiscountConditionOperator } from "../../types"

export interface DiscountFormValues extends FieldValues {
  id?: string
  code?: string
  rule?: {
    id?: string
    value?: number
  }
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

export const discountToFormValuesMapper = (
  discount: Discount
): DiscountFormValues => {
  return {
    id: discount.id,
    code: discount.code,
    rule_id: discount.rule.id,
    type: discount.rule.type,
    rule: {
      id: discount.rule.id,
      value: discount.rule.value,
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
  return {
    code: values.code!,
    rule: {
      allocation: values.allocation,
      type: values.type,
      value:
        values.type !== "free_shipping"
          ? parseInt((values.rule!.value! as unknown) as string, 10)
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

const mapConditionsToUpdate = (map: ConditionMap) => {
  const conditions: AdminUpsertCondition[] = []

  for (const [key, value] of Object.entries(map)) {
    if (value && value.items.length) {
      conditions.push({
        id: value.id,
        operator: DiscountConditionOperator.IN,
        [key]: value.items.map((i) => i.id),
      })
    }
  }

  return conditions
}

export const formValuesToUpdateDiscountMapper = (
  values: DiscountFormValues,
  conditions: ConditionMap
): AdminPostDiscountsDiscountReq => {
  return {
    code: values.code,
    rule: {
      allocation: values.allocation,
      id: values.rule!.id!,
      type: values.type,
      value: parseInt((values.rule!.value as unknown) as string, 10),
      description: values.description,
      conditions: mapConditionsToUpdate(conditions),
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

const mapCreateConditions = (record: ConditionMap): AdminCreateCondition[] => {
  const conditions: AdminCreateCondition[] = []

  for (const value of Object.values(record)) {
    if (value && value.items.length) {
      conditions.push({
        operator: DiscountConditionOperator.IN,
        [value.type]: value.items?.map((i) => i.id),
      })
    }
  }

  return conditions
}
