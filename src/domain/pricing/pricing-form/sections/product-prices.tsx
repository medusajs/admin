import { Product } from "@medusajs/medusa"
import * as React from "react"
import FileUploadField from "../../../../components/atoms/file-upload-field"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import SearchIcon from "../../../../components/fundamentals/icons/search-icon"
import LoadingContainer from "../../../../components/loading-container"
import { ActionType } from "../../../../components/molecules/actionables"
import InputField from "../../../../components/molecules/input"
import ProductVariantTree from "../../../../components/organisms/product-variant-tree"
import AddProductsModal from "../../../../components/templates/add-products-modal"

export type ProductPricesProps = {
  products: Product[]
  setProducts: (products: Product[]) => void
  getVariantActions?: (product: Product) => ActionType[] | undefined
  getProductActions?: (product: Product) => ActionType[] | undefined
  isLoading?: boolean
  onSearch?: (query: string) => void
  onFileChosen?: (files: any[]) => void
}

const ProductPrices = ({
  products,
  setProducts,
  isLoading = false,
  onSearch,
  onFileChosen,
  getVariantActions = () => undefined,
  getProductActions = () => undefined,
}: ProductPricesProps) => {
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
            text={
              <span>
                Drop your price list file here, or{" "}
                <span className="text-violet-60">click to browse</span>
              </span>
            }
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

export default ProductPrices
