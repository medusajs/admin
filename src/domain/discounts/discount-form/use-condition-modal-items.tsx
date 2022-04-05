import React from "react"
import { useContext } from "react"
import { LayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import ProductConditionSelector from "./condition-tables/products"

// <ProductConditionSelector
//               items={[]}
//               onClose={() => close()}
//               saveCondition={console.log} />,

const useConditionModalItems = (close: () => void) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const items = [
    {
      label: "Product",
      value: "products",
      description: "Only for specific products",
      onClick: () =>
        layeredModalContext.push({
          title: "Product",
          onBack: () => layeredModalContext.pop(),
          view: (
            <ProductConditionSelector
              items={[]}
              onClose={() => close()}
              saveCondition={console.log}
            />
          ),
        }),
    },
    {
      label: "Customer group",
      value: "customer_groups",
      description: "Only for specific customer groups",
      onClick: () => console.log("clicked"),
    },
    {
      label: "Tag",
      value: "tags",
      description: "Only for specific tags",
      onClick: () => console.log("clicked"),
    },
    {
      label: "Collection",
      value: "collections",
      description: "Only for specific product collections",
      onClick: () => console.log("clicked"),
    },
    {
      label: "Type",
      value: "types",
      description: "Only for specific product types",
      onClick: () => console.log("clicked"),
    },
  ]

  return items
}

export default useConditionModalItems
