import * as React from "react"
import ProductForm from "./product-form"
import { ProductFormProvider } from "./product-form/form/product-form-context"

const NewProductPage = () => {
  return (
    <ProductFormProvider>
      <ProductForm />
    </ProductFormProvider>
  )
}

export default NewProductPage
