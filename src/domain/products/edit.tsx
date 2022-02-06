import { navigate } from "gatsby"
import { useAdminProduct, useAdminUpdateProduct } from "medusa-react"
import React from "react"
import Spinner from "../../components/atoms/spinner"
import Button, { ButtonProps } from "../../components/fundamentals/button"
import useToaster from "../../hooks/use-toaster"
import { getErrorMessage } from "../../utils/error-messages"
import ProductForm from "./product-form"
import {
  formValuesToProductMapper,
  productToFormValuesMapper,
} from "./product-form/form/mappers"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"

const EditProductPage = ({ id }) => {
  const toaster = useToaster()
  const { product, isLoading } = useAdminProduct(id)
  const updateProduct = useAdminUpdateProduct(id)

  const onSubmit = (data) => {
    console.log(data)
    updateProduct.mutate(formValuesToProductMapper(data), {
      onSuccess: () => {
        toaster("Product updated successfully", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }
  return isLoading ? (
    <div className="w-full pt-2xlarge flex items-center justify-center">
      <Spinner size={"large"} variant={"secondary"} />
    </div>
  ) : (
    <ProductFormProvider
      product={productToFormValuesMapper(product)}
      onSubmit={console.log}
    >
      <ProductForm product={product} isEdit />
      <div className="mt-base flex justify-end items-center gap-x-2">
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <SaveButton
          loading={updateProduct.isLoading}
          variant="primary"
          size="medium"
          type="button"
        >
          Save
        </SaveButton>
      </div>
    </ProductFormProvider>
  )
}

const SaveButton = ({ children, ...props }: ButtonProps) => {
  const { onSubmit, handleSubmit } = useProductForm()

  const onSave = (values) => {
    onSubmit({ ...values })
  }

  return (
    <Button {...props} onClick={handleSubmit(onSave)}>
      {children}
    </Button>
  )
}

export default EditProductPage
