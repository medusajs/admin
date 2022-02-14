import { useAdminProduct, useAdminUpdateProduct } from "medusa-react"
import React from "react"
import Spinner from "../../components/atoms/spinner"
import Medusa from "../../services/api"
import ProductForm from "./product-form"
import {
  formValuesToUpdateProductMapper,
  productToFormValuesMapper,
} from "./product-form/form/mappers"
import { ProductFormProvider } from "./product-form/form/product-form-context"
import { consolidateImages } from "./product-form/utils"

const EditProductPage = ({ id }) => {
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

    updateProduct.mutate(formValuesToUpdateProductMapper(newData))
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
    </ProductFormProvider>
  )
}

export default EditProductPage
