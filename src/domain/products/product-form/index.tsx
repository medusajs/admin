import { useAdminStore } from "medusa-react"
import * as React from "react"
import { useProductForm } from "./form/product-form-context"
import General from "./sections/general"
import Images from "./sections/images"
import Prices from "./sections/prices"
import StockAndInventory from "./sections/stock-inventory"
import Variants from "./sections/variants"

const ProductForm = ({ product }) => {
  const { isVariantsView } = useProductForm()
  const { store } = useAdminStore()
  const currencyCodes = store?.currencies.map((currency) => currency.code)

  return (
    <>
      <div>
        <General />
      </div>
      {isVariantsView && (
        <div className="mt-large">
          <Variants product={product} />
        </div>
      )}
      <div className="mt-large">
        <Prices
          currencyCodes={currencyCodes}
          defaultCurrencyCode={store?.default_currency_code}
          defaultAmount={1000}
        />
      </div>
      <div className="mt-large">
        <Images />
      </div>
      <div className="mt-large">
        <StockAndInventory />
      </div>
    </>
  )
}

export default ProductForm
