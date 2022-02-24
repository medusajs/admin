import { navigate } from "gatsby"
import { useAdminCreateProduct, useAdminUpdateProduct } from "medusa-react"
import Medusa from "../../../../services/api"
import { consolidateImages } from "../utils"
import {
  formValuesToCreateProductMapper,
  formValuesToUpdateProductMapper,
} from "./mappers"

export const useFormActions = (id: string, viewType: string) => {
  const createProduct = useAdminCreateProduct()
  const updateProduct = useAdminUpdateProduct(id)

  const onCreate = async (data) => {
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

    return createProduct.mutateAsync(
      formValuesToCreateProductMapper(data, viewType),
      {
        onSuccess: ({ product }) => {
          navigate(`/a/products/${product.id}`)
        },
      }
    )
  }

  const onCreateAndPublish = async (data) => {
    return onCreate({ ...data, status: "published" })
  }

  const onCreateDraft = async (data) => {
    return onCreate({ ...data, status: "draft" })
  }

  const onUpdate = async (data) => {
    console.log(data)
    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)

    let uploadedImgs = []
    if (images.length > 0) {
      console.log("found images")
      uploadedImgs = await Medusa.uploads.create(images).then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        return uploaded
      })
    }

    const newData = {
      ...data,
      images: consolidateImages(data.images, uploadedImgs),
    }

    return updateProduct.mutateAsync(formValuesToUpdateProductMapper(newData))
  }

  return {
    onCreateAndPublish,
    onCreateDraft,
    onUpdate,
  }
}
