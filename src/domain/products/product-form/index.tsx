import { useAdminStore } from "medusa-react"
import * as React from "react"
import ReactJson from "react-json-view"
import BodyCard from "../../../components/organisms/body-card"
import { useProductForm } from "./form/product-form-context"
import General from "./sections/general"
import Images from "./sections/images"
import Prices from "./sections/prices"
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
    <>
      <div>
        <General isEdit product={product} showViewOptions={!isEdit} />
      </div>
      {(isVariantsView || isEdit) && (
        <div className="mt-large">
          <Variants product={product} />
        </div>
      )}
      {!isVariantsView && (
        <div className="mt-large">
          <Prices
            currencyCodes={currencyCodes}
            defaultCurrencyCode={store?.default_currency_code}
            defaultAmount={1000}
          />
        </div>
      )}
      <div className="mt-large">
        <Images />
      </div>
      <div className="mt-large">
        <StockAndInventory />
      </div>
      <div className="mt-large">
        <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Raw Product">
          <div className="flex flex-col min-h-[100px] mt-4 bg-grey-5 px-3 py-2 h-full rounded-rounded">
            <span className="inter-base-semibold">
              Data{" "}
              <span className="text-grey-50 inter-base-regular">(1 item)</span>
            </span>
            <div className="flex flex-grow items-center mt-4">
              <ReactJson name={false} collapsed={true} src={product} />
            </div>
          </div>
        </BodyCard>
      </div>
    </>
  )
}

export default ProductForm
