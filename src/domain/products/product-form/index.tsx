import { useAdminStore } from "medusa-react"
import * as React from "react"
import FeatureToggle from "../../../components/fundamentals/feature-toggle"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import RawJSON from "../../../components/organisms/raw-json"
import { useProductForm } from "./form/product-form-context"
import General from "./sections/general"
import Images from "./sections/images"
import Prices from "./sections/prices"
import SalesChannels from "./sections/sales-channels"
import StockAndInventory from "./sections/stock-inventory"
import Variants from "./sections/variants"

type ProductFormProps = {
  product?: any
  isEdit?: boolean
}

const ProductForm = ({ product, isEdit = false }: ProductFormProps) => {
  const { isVariantsView } = useProductForm()
  const { store } = useAdminStore()
  const currencyCodes = store?.currencies.map((currency) => currency.code)

  return (
    <div>
      <Breadcrumb
        currentPage={"Product Details"}
        previousBreadcrumb={"Products"}
        previousRoute="/a/products"
      />
      <div className="flex flex-col space-y-base pb-2xlarge">
        <General isEdit={isEdit} product={product} showViewOptions={!isEdit} />

        <FeatureToggle featureFlag="sales_channels">
          <SalesChannels isEdit={isEdit} product={product} />
        </FeatureToggle>

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
    </div>
  )
}

export default ProductForm
