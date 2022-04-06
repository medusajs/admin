import {
  AdminCreateCondition,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
  Discount,
  DiscountConditionOperator,
} from "@medusajs/medusa"
import { FieldValues } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { PromotionConditionRecord } from "./discount-form-context"

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
  record: PromotionConditionRecord
): AdminCreateCondition[] => {
  const conditions: AdminCreateCondition[] = []

  for (const [key, value] of Object.entries(record)) {
    if (value) {
      conditions.push({
        operator: DiscountConditionOperator.IN,
        [key]: value.map((v) => v.id),
      })
    }
  }

  return conditions
}
