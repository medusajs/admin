import { extractProductOptions, extractRegionOptions } from "./extract-options"
import { displayAmount } from "./prices"

type DiscountState = {
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
  setDiscountType: (value: React.SetStateAction<string>) => void
  setRegionsDisabled?: (value: React.SetStateAction<boolean>) => void
}

type HydrationProps = {
  discount?: DiscountState
  actions: HydrationActions
  isEdit?: boolean
}

export const hydrateDiscount = ({
  discount,
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
    setDiscountType,
    setRegionsDisabled,
    setSelectedRegions,
    setIsDisabled,
  },
  isEdit = false,
}: HydrationProps): void => {
  if (!discount) return

  setValue("code", isEdit ? discount.code : `${discount.code}_COPY`)
  setValue("usage_limit", discount.usage_limit)
  setValue("rule.description", discount.rule.description)
  setAllocationItem(discount.rule.allocation === "item")
  setStartDate(discount.starts_at)

  if (discount.rule.type === "fixed") {
    const displayPrice = displayAmount(
      discount.regions[0].currency_code,
      discount.rule.value
    )
    setValue("rule.value", displayPrice)
  } else {
    setValue("rule.value", discount.rule.value)
  }

  if (setIsDisabled) {
    setIsDisabled(discount.is_disabled)
  }

  if (discount.ends_at) {
    setHasExpiryDate(true)
    setExpiryDate(discount.ends_at)
  }

  if (discount.valid_duration) {
    setAvailabilityDuration(discount.valid_duration)
  }

  if (discount.rule.valid_for.length > 0) {
    setAppliesToAll(false)
    setSelectedProducts(extractProductOptions(discount.rule.valid_for))
  } else {
    setAppliesToAll(true)
  }

  if (discount.regions.length) {
    setSelectedRegions(extractRegionOptions(discount.regions))
  }

  if (discount.is_dynamic) {
    setIsDynamic(true)
  }

  if (discount.rule.type === "free_shipping") {
    setIsFreeShipping(true)
  } else if (discount.rule.type === "percentage") {
    setDiscountType("percentage")
  } else {
    setDiscountType("fixed")

    if (isEdit && setRegionsDisabled) {
      setRegionsDisabled(true)
    }
  }
}
