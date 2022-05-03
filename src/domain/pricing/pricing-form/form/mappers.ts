import {
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  PriceList,
} from "@medusajs/medusa"
import { PriceListFormValues, PriceListStatus, PriceListType } from "../types"

export const mapPriceListToFormValues = (
  priceList: PriceList
): PriceListFormValues => {
  return {
    description: priceList.description,
    type: priceList.type,
    name: priceList.name,
    ends_at: priceList.ends_at,
    starts_at: priceList.starts_at,
    prices: priceList.prices.map((p) => ({
      amount: p.amount,
      max_quantity: p.max_quantity,
      min_quantity: p.min_quantity,
      variant_id: p.variant_id,
      currency_code: p.currency_code,
      region_id: p.region_id,
    })),
    customer_groups: priceList.customer_groups.map((pl) => ({
      label: pl.name,
      value: pl.id,
    })),
  }
}

export const mapFormValuesToCreatePriceList = (
  values: PriceListFormValues,
  status: PriceListStatus
): AdminPostPriceListsPriceListReq => {
  return {
    description: values.description!,
    name: values.name!,
    type: PriceListType.SALE,
    status,
    customer_groups: values.customer_groups
      ? values.customer_groups.map((cg) => ({ id: cg.value }))
      : undefined,
    ends_at: values.ends_at || undefined,
    starts_at: values.starts_at || undefined,
    prices: [
      // TODO: Replace when addding prices has been added
      {
        amount: 2500,
        currency_code: "usd",
        variant_id: "variant_01FVW8P3RV037TZEF6QPH17ZN7", // Replace this with a variant_id from your DB for testing purposes
      },
    ],
  }
}

export const mapFormValuesToUpdatePriceListDetails = (
  values: PriceListFormValues
): AdminPostPriceListsPriceListPriceListReq => {
  return {
    name: values.name || undefined,
    description: values.description || undefined,
    customer_groups: values.customer_groups
      ? values.customer_groups.map((cg) => ({ id: cg.value }))
      : undefined,
    ends_at: values.ends_at || undefined,
    starts_at: values.starts_at || undefined,
    type: values.type || undefined,
  }
}

export const mapFormValuesToUpdatePriceListPrices = (
  values: PriceListFormValues
): AdminPostPriceListsPriceListPriceListReq => {
  return {
    prices: values.prices!,
  }
}
