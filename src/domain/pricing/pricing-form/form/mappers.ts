import {
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
} from "@medusajs/medusa"
import { PriceListFormValues, PriceListStatus, PriceListType } from "../types"

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
        variant_id: "variant_01FY6FS47101G8MKK7PDVHPWZ0", // Replace this with a variant_id from your DB for testing purposes
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
