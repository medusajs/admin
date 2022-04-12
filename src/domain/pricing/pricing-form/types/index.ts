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
  name: string
  description: string | null
  start_date: Date | null
  end_date: Date | null
  customer_groups: string[] | null
  prices: CreatePriceProps[]
}
