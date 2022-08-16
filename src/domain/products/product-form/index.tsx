import { Product } from "@medusajs/medusa"
import { useAdminStore } from "medusa-react"
import * as React from "react"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import RawJSON from "../../../components/organisms/raw-json"
import { useProductForm } from "./form/product-form-context"
import GeneralSection from "./sections/general/index"
import Images from "./sections/images"
import Prices from "./sections/prices"
import StockAndInventory from "./sections/stock-inventory"
import Variants from "./sections/variants"

type ProductFormProps = {
  product?: Product
  isEdit?: boolean
}

const ProductForm = ({ product, isEdit = false }: ProductFormProps) => {
  const { isVariantsView } = useProductForm()
  const { store } = useAdminStore()
  const currencyCodes = store?.currencies.map((currency) => currency.code)

  return (
    <div className="pb-2xlarge">
      <Breadcrumb
        currentPage={"Product Details"}
        previousBreadcrumb={"Products"}
        previousRoute="/a/products"
      />
      <div className="grid grid-cols-3 gap-x-4">
        <div className="flex flex-col space-y-base col-start-1 col-span-2">
          {product && <GeneralSection product={product} />}
          {(isVariantsView || isEdit) && (
            <Variants isEdit={isEdit} product={product} />
          )}

          {!isVariantsView && !isEdit && (
            <Prices
              currencyCodes={currencyCodes}
              defaultCurrencyCode={store?.default_currency_code}
              defaultAmount={1000}
            />
          )}

          <Images />

          <StockAndInventory />

          <RawJSON data={product} title="Raw product" />
        </div>
        <div className="col-span-1 flex flex-col gap-y-4">
          <div className="bg-grey-0">Thumbnail</div>
          <div className="bg-grey-0">Media</div>
        </div>
      </div>
    </divdiv>
  )
}

export default ProductForm
