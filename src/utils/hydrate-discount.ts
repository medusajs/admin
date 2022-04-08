import { extractProductOptions, extractRegionOptions } from "./extract-options"
import { displayAmount } from "./prices"

type PromotionState = {
  code: string
  usage_limit: number
  rule: {
    value: number
    description: string
    allocation: string
    valid_for: { title: string; id: string }[]
    type: string
  }
  ends_at?: Date
  starts_at: Date
  valid_duration: string
  regions: { name: string; id: string; currency_code: string }[]
  is_dynamic: boolean
  is_disabled: boolean
}

type HydrationActions = {
  setValue: (
    name: string,
    value: unknown,
    config?:
      | Partial<{
          shouldValidate: boolean
          shouldDirty: boolean
        }>
      | undefined
  ) => void
  setAllocationItem: (value: React.SetStateAction<boolean | undefined>) => void
  setStartDate: (value: React.SetStateAction<Date>) => void
  setExpiryDate: (value: React.SetStateAction<Date | undefined>) => void
  setHasExpiryDate: (value: React.SetStateAction<boolean>) => void
  setAvailabilityDuration: (
    value: React.SetStateAction<string | undefined>
  ) => void
  setAppliesToAll: (value: React.SetStateAction<boolean>) => void
  setSelectedProducts: (
    value: React.SetStateAction<
      {
        label: string
        value: string
      }[]
    >
  ) => void
  setSelectedRegions: (
    value: React.SetStateAction<
      {
        label: string
        value: string
      }[]
    >
  ) => void
  setIsDynamic: (value: React.SetStateAction<boolean>) => void
  setIsFreeShipping: (value: React.SetStateAction<boolean>) => void
  setIsDisabled?: (value: React.SetStateAction<boolean>) => void
  setPromotionType: (value: React.SetStateAction<string>) => void
  setRegionsDisabled?: (value: React.SetStateAction<boolean>) => void
}

type HydrationProps = {
  promotion?: PromotionState
  actions: HydrationActions
  isEdit?: boolean
}

export const hydratePromotion = ({
  promotion: promotion,
  actions: {
    setValue,
    setAllocationItem,
    setStartDate,
    setExpiryDate,
    setHasExpiryDate,
    setAvailabilityDuration,
    setAppliesToAll,
    setSelectedProducts,
    setIsDynamic,
    setIsFreeShipping,
    setPromotionType,
    setRegionsDisabled,
    setSelectedRegions,
    setIsDisabled,
  },
  isEdit = false,
}: HydrationProps): void => {
  if (!promotion) {
    return
  }

  setValue("code", isEdit ? promotion.code : `${promotion.code}_COPY`)
  setValue("usage_limit", promotion.usage_limit)
  setValue("rule.description", promotion.rule.description)
  setAllocationItem(promotion.rule.allocation === "item")
  setStartDate(promotion.starts_at)

  if (promotion.rule.type === "fixed") {
    const displayPrice = displayAmount(
      promotion.regions[0].currency_code,
      promotion.rule.value
    )
    setValue("rule.value", displayPrice)
  } else {
    setValue("rule.value", promotion.rule.value)
  }

  if (setIsDisabled) {
    setIsDisabled(promotion.is_disabled)
  }

  if (promotion.ends_at) {
    setHasExpiryDate(true)
    setExpiryDate(promotion.ends_at)
  }

  if (promotion.valid_duration) {
    setAvailabilityDuration(promotion.valid_duration)
  }

  if (promotion.rule.valid_for.length > 0) {
    setAppliesToAll(false)
    setSelectedProducts(extractProductOptions(promotion.rule.valid_for))
  } else {
    setAppliesToAll(true)
  }

  if (promotion.regions.length) {
    setSelectedRegions(extractRegionOptions(promotion.regions))
  }

  if (promotion.is_dynamic) {
    setIsDynamic(true)
  }

  if (promotion.rule.type === "free_shipping") {
    setIsFreeShipping(true)
  } else if (promotion.rule.type === "percentage") {
    setPromotionType("percentage")
  } else {
    setPromotionType("fixed")

    if (isEdit && setRegionsDisabled) {
      setRegionsDisabled(true)
    }
  }
}
