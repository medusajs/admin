import Medusa from "../../../../services/api"
import {
  ExistingImage,
  ImageFormValues,
  UploadImage,
  VariantFormValues,
} from "./types"

type BuildOptionsMap = (product: any, variant?: any) => { [key: string]: any }

export const buildOptionsMap: BuildOptionsMap = (
  product,
  variant = { options: [] }
) => {
  const optionsMap = product?.options?.reduce((map, { title, id }) => {
    map[id] = { title, value: "", option_id: id }
    return map
  }, {})

  variant?.options?.forEach(({ option_id, ...option }) => {
    if (option_id) {
      optionsMap[option_id] = {
        ...optionsMap[option_id],
        option_id,
        ...option,
      }
    }
  })

  return optionsMap
}

export const getVariantTitle = (variant: VariantFormValues) => {
  const { title, options } = variant

  if (title) {
    return title
  }

  return options.map((o) => o.value).join(" / ")
}

const splitImages = (
  images: ImageFormValues
): { uploadImages: UploadImage[]; existingImages: ExistingImage[] } => {
  const uploadImages: UploadImage[] = []
  const existingImages: ExistingImage[] = []

  images.forEach((image) => {
    if ("nativeFile" in image) {
      uploadImages.push(image)
    } else {
      existingImages.push(image)
    }
  })

  return { uploadImages, existingImages }
}

export const prepareImages = async (images: ImageFormValues) => {
  const { uploadImages, existingImages } = splitImages(images)

  let uploadedImgs: ExistingImage[] = []
  if (uploadImages.length > 0) {
    uploadedImgs = await Medusa.uploads.create(images).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => {
        url
      })
      return uploaded
    })
  }

  return [...existingImages, ...uploadedImgs]
}
