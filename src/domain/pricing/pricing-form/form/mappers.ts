import {
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  PriceList,
} from "@medusajs/medusa"
import xorObjFields from "../../../../utils/xorObjFields"
import {
  CreatePriceListFormValues,
  PriceListFormValues,
  PriceListStatus,
  PriceListType,
} from "../types"

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
  values: CreatePriceListFormValues,
  status: PriceListStatus
): AdminPostPriceListsPriceListReq => {
  let prices
  if (values.prices) {
    prices = Object.entries(values.prices)
      .map(([variantId, price]) =>
        price.map((pr) => ({
          variant_id: variantId,
          amount: pr.amount,
          ...xorObjFields(pr, "currency_code", "region_id"),
          min_quantity: pr.min_quantity,
          max_quantity: pr.max_quantity,
        }))
      )
      .flat(1)
  }

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
    prices,
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
