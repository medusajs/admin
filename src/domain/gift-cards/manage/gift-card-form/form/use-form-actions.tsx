import { useAdminUpdateProduct } from "medusa-react"
import Medusa from "../../../../../services/api"
import { consolidateImages } from "../../../../../utils/consolidate-images"
import { formValuesToUpdateGiftCardMapper } from "./mappers"

export const useUpdateGiftCard = (id: string) => {
  const updateGiftCard = useAdminUpdateProduct(id)

  const onUpdate = async (data) => {
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

    return updateGiftCard.mutateAsync(formValuesToUpdateGiftCardMapper(newData))
  }

  return {
    onUpdate,
  }
}
