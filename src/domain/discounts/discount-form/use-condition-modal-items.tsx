import React, { useContext } from "react"
import { LayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import { DiscountConditionType } from "../types"
import CollectionConditionSelector from "./condition-tables/collections"
import CustomerGroupConditionSelector from "./condition-tables/customer-groups"
import ProductConditionSelector from "./condition-tables/products"
import TagConditionSelector from "./condition-tables/tags"
import TypeConditionSelector from "./condition-tables/types"

export type ConditionItem = {
  label: string
  value: DiscountConditionType
  description: string
  onClick: () => void
}

const useConditionModalItems = (close: () => void) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const items: ConditionItem[] = [
    {
      label: "Product",
      value: DiscountConditionType.PRODUCTS,
      description: "Only for specific products",
      onClick: () =>
        layeredModalContext.push({
          title: "Products",
          onBack: () => layeredModalContext.pop(),
          view: <ProductConditionSelector onClose={() => close()} />,
        }),
    },
    {
      label: "Customer group",
      value: DiscountConditionType.CUSTOMER_GROUPS,
      description: "Only for specific customer groups",
      onClick: () =>
        layeredModalContext.push({
          title: "Customer groups",
          onBack: () => layeredModalContext.pop(),
          view: <CustomerGroupConditionSelector onClose={close} />,
        }),
    },
    {
      label: "Tag",
      value: DiscountConditionType.PRODUCT_TAGS,
      description: "Only for specific tags",
      onClick: () =>
        layeredModalContext.push({
          title: "Product tags",
          onBack: () => layeredModalContext.pop(),
          view: <TagConditionSelector onClose={close} />,
        }),
    },
    {
      label: "Collection",
      value: DiscountConditionType.PRODUCT_COLLECTIONS,
      description: "Only for specific product collections",
      onClick: () =>
        layeredModalContext.push({
          title: "Collections",
          onBack: () => layeredModalContext.pop(),
          view: <CollectionConditionSelector onClose={() => close()} />,
        }),
    },
    {
      label: "Type",
      value: DiscountConditionType.PRODUCT_TYPES,
      description: "Only for specific product types",
      onClick: () =>
        layeredModalContext.push({
          title: "Product types",
          onBack: () => layeredModalContext.pop(),
          view: <TypeConditionSelector onClose={() => close()} />,
        }),
    },
  ]

  return items
}

export default useConditionModalItems
