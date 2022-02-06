import { useAdminProduct, useAdminUpdateProduct } from "medusa-react"
import React from "react"
import useToaster from "../../hooks/use-toaster"
import { getErrorMessage } from "../../utils/error-messages"
import ProductForm from "./product-form"
import { productToFormValuesMapper } from "./product-form/form/mappers"
import { ProductFormProvider } from "./product-form/form/product-form-context"

const EditProductPage = ({ id }) => {
  const toaster = useToaster()
  const { product } = useAdminProduct(id)
  const updateProduct = useAdminUpdateProduct(id)

  const onSubmit = (data) => {
    console.log(data)
    updateProduct.mutate(data, {
      onSuccess: () => {
        toaster("Product updated successfully", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }
  return (
    <ProductFormProvider
      product={productToFormValuesMapper(product)}
      onSubmit={console.log}
    >
      <ProductForm product={product} />
    </ProductFormProvider>
  )
}

export default EditProductPage
