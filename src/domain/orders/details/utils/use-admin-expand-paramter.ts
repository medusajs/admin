import * as React from "react"
import { FeatureFlagContext } from "../../../../context/feature-flag"

const orderRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "fulfillments.items",
  "returns",
  "returns.shipping_method",
  "returns.shipping_method.tax_lines",
  "returns.items",
  "returns.items.reason",
  "gift_cards",
  "gift_card_transactions",
  "claims",
  "claims.return_order",
  "claims.return_order.shipping_method",
  "claims.return_order.shipping_method.tax_lines",
  "claims.shipping_methods",
  "claims.shipping_address",
  "claims.additional_items",
  "claims.fulfillments",
  "claims.fulfillments.tracking_links",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.claim_items.images",
  "swaps",
  "swaps.return_order",
  "swaps.return_order.shipping_method",
  "swaps.return_order.shipping_method.tax_lines",
  "swaps.payment",
  "swaps.shipping_methods",
  "swaps.shipping_methods.tax_lines",
  "swaps.shipping_address",
  "swaps.additional_items",
  "swaps.fulfillments",
  "swaps.fulfillments.tracking_links",
]

const useOrdersExpandParam = () => {
  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)

  const editsEnabled = isFeatureEnabled("order_editing")

  if (editsEnabled) {
    if (orderRelations.indexOf("edits") === -1) {
      orderRelations.push("edits")
    }
  }

  return {
    orderRelations: orderRelations.join(","),
  }
}

export default useOrdersExpandParam
