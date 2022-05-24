import { AdminPostPriceListsPriceListPriceListReq } from "@medusajs/medusa"
import { PriceOverridesFormValues } from "../../../../../../components/templates/price-overrides"
import xorObjFields from "../../../../../../utils/xorObjFields"

export const mapToPriceList = (values: PriceOverridesFormValues) => {
  return values.prices
    .map((price) => {
      return values.variants.map((variant) => ({
        id: price.id,
        variant_id: variant,
        ...xorObjFields(price, "currency_code", "region_id"),
        amount: price.amount,
        min_quantity: price.min_quantity,
        max_quantity: price.max_quantity,
      }))
    })
    .flat(1) as AdminPostPriceListsPriceListPriceListReq["prices"]
}
