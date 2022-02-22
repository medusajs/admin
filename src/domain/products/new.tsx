import { navigate } from "gatsby"
import { useAdminCreateProduct } from "medusa-react"
import * as React from "react"
import Medusa from "../../services/api"
import ProductForm from "./product-form"
import { formValuesToCreateProductMapper } from "./product-form/form/mappers"
import { ProductFormProvider } from "./product-form/form/product-form-context"
import { consolidateImages } from "./product-form/utils"

const NewProductPage = () => {
  const createProduct = useAdminCreateProduct()

  const onSubmit = async (data) => {
    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)

    if (images.length) {
      const uploadedImgs = await Medusa.uploads
        .create(images)
        .then(({ data }) => {
          const uploaded = data.uploads.map(({ url }) => url)
          return uploaded
        })

      data.images = consolidateImages(data.images, uploadedImgs)
    }

    createProduct.mutate(formValuesToCreateProductMapper(data), {
      onSuccess: ({ product }) => {
        navigate(`/a/products/${product.id}`)
      },
    })
  }

  return (
    <ProductFormProvider onSubmit={onSubmit}>
      <ProductForm />
    </ProductFormProvider>
  )
}

export default NewProductPage
