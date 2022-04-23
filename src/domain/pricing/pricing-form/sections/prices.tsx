import { Product } from "@medusajs/medusa"
import { useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import Accordion from "../../../../components/organisms/accordion"
import { merge } from "../../details/sections/prices-details/utils"
import ProductPrices from "./product-prices"

type PricesSectionProps = {
  isEdit?: boolean
  id?: string
}

const defaultQueryFilters = {
  limit: 50,
  offset: 0,
}

const PricesSection = ({ isEdit = false, id }: PricesSectionProps) => {
  const { products = [], isLoading } = useAdminPriceListProducts(
    id!,
    defaultQueryFilters,
    {
      enabled: isEdit,
    }
  )

  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])
  const mergedProducts = merge(products, selectedProducts)

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
        products={mergedProducts}
        isLoading={isLoading}
        setProducts={setSelectedProducts}
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
