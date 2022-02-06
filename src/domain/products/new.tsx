import * as React from "react"
import { navigate } from "gatsby"
import { useAdminCreateProduct } from "medusa-react"
import Button, { ButtonProps } from "../../components/fundamentals/button"
import useToaster from "../../hooks/use-toaster"
import Medusa from "../../services/api"
import { getErrorMessage } from "../../utils/error-messages"
import ProductDetail from "./product-form"
import { formValuesToProductMapper } from "./product-form/form/mappers"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"

const getImages = (images, uploaded) => {
  const result: any[] = []
  let i = 0
  let j = 0
  for (i = 0; i < images.length; i++) {
    const image = images[i].url
    if (image.startsWith("blob")) {
      result.push(uploaded[j])
      j++
    } else {
      result.push(image)
    }
  }
  return result
}

const NewProductPage = () => {
  const toaster = useToaster()
  const createProduct = useAdminCreateProduct()

  const onSubmit = async (data) => {
    console.log({ data: formValuesToProductMapper(data) })
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
      images: getImages(data.images, uploadedImgs),
    }

    createProduct.mutate(formValuesToProductMapper(newData), {
      onSuccess: () => {
        toaster("Product created successfully", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  return (
    <ProductFormProvider onSubmit={onSubmit}>
      <ProductDetail />
      <div className="mt-base flex justify-end items-center gap-x-2">
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
