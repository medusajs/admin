export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}

export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

export type PriceListTypeFormData = {
  type: PriceListType
}

export type PriceListGeneralFormData = {
  name: string
  description: string
}

export type PriceListCustomerGroup = {
  value: string
  label: string
}

export type PriceListConfigurationFormData = {
  starts_at?: Date | null
  ends_at?: Date | null
  customer_groups?: PriceListCustomerGroup[] | null
  includes_tax: boolean
}

export type PriceListPrice = {
  amount: number
  variant_id: string
  currency_code?: string
  region_id?: string
  min_quantity?: number
  max_quantity?: number
}

export type PriceListPricesFormData = {
  prices: PriceListPrice[]
}

export type NewPriceListFormData = {
  list_type: PriceListTypeFormData
  general: PriceListGeneralFormData
  configuration: PriceListConfigurationFormData
  prices: PriceListPricesFormData
}
