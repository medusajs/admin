import { useAdminProduct } from "medusa-react"
import React from "react"
import Spinner from "../../components/atoms/spinner"
import ProductForm from "./product-form"
import { productToFormValuesMapper } from "./product-form/form/mappers"
import { ProductFormProvider } from "./product-form/form/product-form-context"

const EditProductPage = ({ id }) => {
  const { product, isLoading } = useAdminProduct(id)

  return isLoading ? (
    <div className="w-full pt-2xlarge flex items-center justify-center">
      <Spinner size={"large"} variant={"secondary"} />
    </div>
  ) : (
    <ProductFormProvider product={productToFormValuesMapper(product)} isEdit>
      <ProductForm product={product} isEdit />
    </ProductFormProvider>
  )
}

export default EditProductPage
