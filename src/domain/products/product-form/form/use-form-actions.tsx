import { navigate } from "gatsby"
import { useAdminCreateProduct, useAdminUpdateProduct } from "medusa-react"
import Medusa from "../../../../services/api"
import { consolidateImages } from "../utils"
import {
  formValuesToCreateProductMapper,
  formValuesToUpdateProductMapper,
} from "./mappers"

export const useFormActions = (
  id: string,
  viewType: string,
  data: {
    status?: string
    images: any[]
    variants: any[]
    options: any[]
  }
) => {
  const createProduct = useAdminCreateProduct()
  const updateProduct = useAdminUpdateProduct(id)

  const onCreate = async (values) => {
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

    createProduct.mutateAsync(
      formValuesToCreateProductMapper({ ...values, ...data }, viewType),
      {
        onSuccess: ({ product }) => {
          navigate(`/a/products/${product.id}`)
        },
      }
    )
  }

  const onCreateAndPublish = async (values) => {
    onCreate({ ...values, status: "published" })
  }

  const onCreateDraft = async (values) => {
    onCreate({ ...values, status: "draft" })
  }

  const onUpdate = async (values) => {
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
      ...values,
      ...data,
      images: consolidateImages(data.images, uploadedImgs),
    }

    updateProduct.mutateAsync(formValuesToUpdateProductMapper(newData))
  }

  return {
    onCreateAndPublish,
    onCreateDraft,
    onUpdate,
  }
}
