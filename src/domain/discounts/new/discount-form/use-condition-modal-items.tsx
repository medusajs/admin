import React, { useContext } from "react"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { DiscountConditionType } from "../../types"
import AddCollectionConditionSelector from "./condition-tables/add-condition-tables/collections"
import AddCustomerGroupConditionSelector from "./condition-tables/add-condition-tables/customer-groups"
import AddProductConditionSelector from "./condition-tables/add-condition-tables/products"
import AddTagConditionSelector from "./condition-tables/add-condition-tables/tags"
import AddTypeConditionSelector from "./condition-tables/add-condition-tables/types"

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
          title: "Choose products",
          onBack: () => layeredModalContext.pop(),
          view: <AddProductConditionSelector onClose={() => close()} />,
        }),
    },
    {
      label: "Customer group",
      value: DiscountConditionType.CUSTOMER_GROUPS,
      description: "Only for specific customer groups",
      onClick: () =>
        layeredModalContext.push({
          title: "Choose groups",
          onBack: () => layeredModalContext.pop(),
          view: <AddCustomerGroupConditionSelector onClose={close} />,
        }),
    },
    {
      label: "Tag",
      value: DiscountConditionType.PRODUCT_TAGS,
      description: "Only for specific tags",
      onClick: () =>
        layeredModalContext.push({
          title: "Choose tags",
          onBack: () => layeredModalContext.pop(),
          view: <AddTagConditionSelector onClose={close} />,
        }),
    },
    {
      label: "Collection",
      value: DiscountConditionType.PRODUCT_COLLECTIONS,
      description: "Only for specific product collections",
      onClick: () =>
        layeredModalContext.push({
          title: "Choose collections",
          onBack: () => layeredModalContext.pop(),
          view: <AddCollectionConditionSelector onClose={() => close()} />,
        }),
    },
    {
      label: "Type",
      value: DiscountConditionType.PRODUCT_TYPES,
      description: "Only for specific product types",
      onClick: () =>
        layeredModalContext.push({
          title: "Choose types",
          onBack: () => layeredModalContext.pop(),
          view: <AddTypeConditionSelector onClose={() => close()} />,
        }),
    },
  ]

  return items
}

export default useConditionModalItems
