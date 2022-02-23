import {
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
  Discount,
} from "@medusajs/medusa"
import { Option } from "../../../../types/shared"

export type DiscountFormValues = {
  id?: string
  code?: string
  rule: {
    id?: string
    type: string
    value?: number
    allocation: string
    description: string
    valid_for: Option[] | null
  }
  starts_at: Date
  ends_at?: Date
  usage_limit?: number
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
    rule: {
      id: discount.rule.id,
      type: discount.rule.type,
      value: discount.rule.value,
      allocation: discount.rule.allocation,
      description: discount.rule.description,
      valid_for: discount.rule.valid_for.length
        ? discount.rule.valid_for.map((v) => ({ label: v.title, value: v.id }))
        : null,
    },
    starts_at: discount.starts_at,
    ends_at: discount.ends_at,
    is_dynamic: discount.is_dynamic,
    usage_limit: discount.usage_limit,
    valid_duration: discount.valid_duration,
    regions: discount.regions
      ? discount.regions.map((r) => ({ label: r.name, value: r.id }))
      : null,
  }
}

export const formValuesToCreateDiscountMapper = (
  values: DiscountFormValues
): AdminPostDiscountsReq => {
  return {
    code: values.code!,
    rule: {
      allocation: values.rule.allocation,
      type: values.rule.type,
      value: parseFloat((values.rule.value! as unknown) as string),
      description: values.rule.description,
      valid_for: values.rule.valid_for?.map((p) => p.value) as any, // supress typescript error. TODO: fix type in core
    },
    is_dynamic: values.is_dynamic,
    ends_at: values.ends_at,
    regions: values.regions?.map((r) => r.value),
    starts_at: values.starts_at,
    usage_limit: parseFloat((values.usage_limit as unknown) as string),
    valid_duration: values.valid_duration,
    is_disabled: false,
  }
}

export const formValuesToUpdateDiscountMapper = (
  values: DiscountFormValues
): AdminPostDiscountsDiscountReq => {
  return {
    code: values.code,
    rule: {
      allocation: values.rule.allocation,
      id: values.rule.id!,
      type: values.rule.type,
      value: `${values.rule.value}`,
      description: values.rule.description,
      valid_for: values.rule.valid_for?.map((p) => p.value) as any, // supress typescript error. TODO: fix type in core
    },
    ends_at: values.ends_at,
    regions: values.regions?.map((r) => r.value),
    starts_at: values.starts_at,
    usage_limit: values.usage_limit,
    valid_duration: values.valid_duration,
  }
}
