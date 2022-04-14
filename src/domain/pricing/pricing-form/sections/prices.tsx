import { Product } from "@medusajs/medusa"
import * as React from "react"
import FileUploadField from "../../../../components/atoms/file-upload-field"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import SearchIcon from "../../../../components/fundamentals/icons/search-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import LoadingContainer from "../../../../components/loading-container"
import { ActionType } from "../../../../components/molecules/actionables"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import ProductVariantTree from "../../../../components/organisms/product-variant-tree"
import AddProductsModal from "../../add-products-modal"

const PricesSection = () => {
  const [products, setProducts] = React.useState<Product[]>([])
  console.log({ products })
  return (
    <Accordion.Item
      forceMountContent
      required
      value="prices"
      title="Prices"
      description="You will be able to override the prices for the products you add here"
      tooltip="Define the price overrides for the price list"
    >
      <Prices
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

export type PricesProps = {
  products: Product[]
  setProducts: (products: Product[]) => void
  getVariantActions?: (product: Product) => ActionType[] | undefined
  getProductActions?: (product: Product) => ActionType[] | undefined
  isLoading?: boolean
  onSearch?: (query: string) => void
  onFileChosen?: (files: any[]) => void
}

export const Prices = ({
  products,
  setProducts,
  isLoading = false,
  onSearch,
  onFileChosen,
  getVariantActions = () => undefined,
  getProductActions = () => undefined,
}: PricesProps) => {
  const [showAdd, setShowAdd] = React.useState(false)

  const onChange = (e) => {
    const query = e.target.value
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <div className="mt-6">
      <div>
        {onSearch && (
          <div className="mb-2">
            <InputField
              placeholder="Search by name or SKU..."
              startAdornment={<SearchIcon />}
              onChange={onChange}
            />
          </div>
        )}
        <div>
          <LoadingContainer isLoading={isLoading}>
            {products.map((product) => (
              <div className="mt-2">
                <ProductVariantTree
                  product={product}
                  key={product.id}
                  productActions={getProductActions(product)}
                  variantActions={getVariantActions(product)}
                />
              </div>
            ))}
          </LoadingContainer>
        </div>
      </div>
      <div className="mt-6">
        <Button
          variant="secondary"
          size="medium"
          className="w-full rounded-rounded"
          onClick={() => setShowAdd(true)}
        >
          <PlusIcon />
          Add Products Manually
        </Button>
      </div>
      {onFileChosen && (
        <div className="mt-3">
          <FileUploadField
            className="py-8"
            onFileChosen={onFileChosen}
            filetypes={[".csx", ".xlsx", ".xls"]}
            placeholder="Only .csv files up to 5MB are supported"
            text="Drop your price list file here or,"
          />
        </div>
      )}
      {showAdd && (
        <AddProductsModal
          onSave={setProducts}
          initialSelection={products}
          close={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}

export default PricesSection
