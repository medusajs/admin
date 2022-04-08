import {
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
  Discount,
} from "@medusajs/medusa"
import { FieldValues } from "react-hook-form"
import { Option } from "../../../../types/shared"

export interface PromotionFormValues extends FieldValues {
  id?: string
  code?: string
  rule_id?: string
  type: string
  value?: number
  allocation: string
  description: string
  valid_for: Option[] | null
  starts_at: Date
  ends_at: Date | null
  usage_limit?: string
  is_dynamic: boolean
  valid_duration?: string
  regions: Option[] | null
}

export const promotionToFormValuesMapper = (
  promotion: Discount
): PromotionFormValues => {
  return {
    id: promotion.id,
    code: promotion.code,
    rule_id: promotion.rule.id,
    type: promotion.rule.type,
    rule: {
      value: promotion.rule.value,
    },
    allocation: promotion.rule.allocation,
    description: promotion.rule.description,
    valid_for: promotion.rule.valid_for.length
      ? promotion.rule.valid_for.map((v) => ({ label: v.title, value: v.id }))
      : null,
    starts_at: new Date(promotion.starts_at),
    ends_at: promotion.ends_at ? new Date(promotion.ends_at) : null,
    is_dynamic: promotion.is_dynamic,
    usage_limit: `${promotion.usage_limit}`,
    valid_duration: promotion.valid_duration,
    regions: promotion.regions
      ? promotion.regions.map((r) => ({ label: r.name, value: r.id }))
      : null,
  }
}

export const formValuesToCreatePromotionMapper = (
  values: PromotionFormValues
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
      valid_for: values.valid_for?.map((p) => p.value),
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

export const formValuesToUpdatePromotionMapper = (
  values: PromotionFormValues
): AdminPostDiscountsDiscountReq => {
  return {
    code: values.code,
    rule: {
      allocation: values.allocation,
      id: values.rule_id!,
      type: values.type,
      value: parseInt((values.rule.value as unknown) as string, 10),
      description: values.description,
      valid_for: values.valid_for?.map((p) => p.value) as any,
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
