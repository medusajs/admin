import { navigate } from "gatsby"
import { useAdminCreateProduct } from "medusa-react"
import * as React from "react"
import Button, { ButtonProps } from "../../components/fundamentals/button"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import { getErrorMessage } from "../../utils/error-messages"
import ProductForm from "./product-form"
import { formValuesToCreateProductMapper } from "./product-form/form/mappers"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"
import { consolidateImages } from "./product-form/utils"

const NewProductPage = () => {
  const notification = useNotification()
  const createProduct = useAdminCreateProduct()

  const onSubmit = async (data, viewType) => {
    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)
    const uploadedImgs = await Medusa.uploads
      .create(images)
      .then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        return uploaded
      })
    const newData = {
      ...data,
      images: consolidateImages(data.images, uploadedImgs),
    }

    createProduct.mutate(formValuesToCreateProductMapper(newData, viewType), {
      onSuccess: ({ product }) => {
        notification("Success", "Product created successfully", "success")
        navigate(`/a/products/${product.id}`)
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <ProductFormProvider onSubmit={onSubmit}>
      <ProductForm />
      <div className="mt-base pb-xlarge flex justify-end items-center gap-x-2">
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <SaveAsDraftButton
          loading={createProduct.isLoading}
          variant="secondary"
          size="small"
          type="button"
        >
          Save as draft
        </SaveAsDraftButton>
        <PublishButton
          loading={createProduct.isLoading}
          variant="primary"
          size="medium"
          type="button"
        >
          Publish Product
        </PublishButton>
      </div>
    </ProductFormProvider>
  )
}

const SaveAsDraftButton = ({ children, ...props }: ButtonProps) => {
  const { onSubmit, handleSubmit } = useProductForm()

  const onSaveDraft = (values) => {
    onSubmit({ ...values, status: "draft" })
  }

  return (
    <Button {...props} onClick={handleSubmit(onSaveDraft)}>
      {children}
    </Button>
  )
}

const PublishButton = ({ children, ...props }: ButtonProps) => {
  const { onSubmit, handleSubmit } = useProductForm()

  const onPublish = (values) => {
    onSubmit({ ...values, status: "published" })
  }
  return (
    <Button {...props} onClick={handleSubmit(onPublish)}>
      {children}
    </Button>
  )
}

export default NewProductPage
