import { navigate } from "gatsby"
import { useAdminProduct, useAdminUpdateProduct } from "medusa-react"
import React from "react"
import Spinner from "../../components/atoms/spinner"
import Button, { ButtonProps } from "../../components/fundamentals/button"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import { getErrorMessage } from "../../utils/error-messages"
import ProductForm from "./product-form"
import {
  formValuesToUpdateProductMapper,
  productToFormValuesMapper,
} from "./product-form/form/mappers"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"
import { consolidateImages } from "./product-form/utils"

const EditProductPage = ({ id }) => {
  const notification = useNotification()
  const { product, isLoading } = useAdminProduct(id)
  const updateProduct = useAdminUpdateProduct(id)

  const onSubmit = async (data) => {
    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)

    let uploadedImgs = []
    if (images.length > 0) {
      uploadedImgs = await Medusa.uploads.create(images).then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        return uploaded
      })
    }

    const newData = {
      ...data,
      images: consolidateImages(data.images, uploadedImgs),
    }

    updateProduct.mutate(formValuesToUpdateProductMapper(newData), {
      onSuccess: () => {
        notification("Success", "Product updated successfully", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
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
      onSubmit={onSubmit}
    >
      <ProductForm product={product} isEdit />
      <div className="mt-base pb-xlarge flex justify-end items-center gap-x-2">
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
