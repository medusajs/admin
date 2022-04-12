/* eslint-disable no-unused-vars */

interface PriceProps {
  amount: number
  variant_id: string
  min_quantity?: number
  max_quantity?: number
}

interface RegionPriceProps extends PriceProps {
  region_id: string
  currency_code?: never
}

interface CurrencyPriceProps extends PriceProps {
  currency_code: string
  region_id?: never
}

/**
 * @description Can have either a region_id or a currency_code, but not both.
 */
type CreatePriceProps = RegionPriceProps | CurrencyPriceProps

export type CreatePriceListFormValues = {
  name: string | null
  description: string | null
  starts_at: Date | null
  ends_at: Date | null
  customer_groups: string[] | null
  prices: CreatePriceProps[] | null
}

export enum ConfigurationField {
  STARTS_AT = "starts_at",
  ENDS_AT = "ends_at",
  CUSTOMER_GROUPS = "customer_groups",
}
