import { Product } from "@medusajs/medusa"
import * as React from "react"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import Accordion from "../../../../components/organisms/accordion"
import ProductPrices from "./product-prices"

const PricesSection = () => {
  const [products, setProducts] = React.useState<Product[]>([])
  return (
    <Accordion.Item
      forceMountContent
      required
      value="prices"
      title="Prices"
      description="You will be able to override the prices for the products you add here"
      tooltip="Define the price overrides for the price list"
    >
      <ProductPrices
        products={products}
        setProducts={setProducts}
        onFileChosen={console.log}
        getVariantActions={VariantActions}
      />
    </Accordion.Item>
  )
}

const VariantActions = (product: Product) => {
  return [
    {
      label: "Remove from list",
      icon: <TrashIcon size={20} />,
      onClick: () => {
        // missing core support
      },
      variant: "danger" as const,
    },
  ]
}

export default PricesSection
