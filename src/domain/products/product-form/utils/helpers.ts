import Medusa from "../../../../services/api"
import { FormImage } from "../../../../types/shared"
import { VariantFormValues } from "./types"

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
  images: FormImage[]
): { uploadImages: FormImage[]; existingImages: FormImage[] } => {
  const uploadImages: FormImage[] = []
  const existingImages: FormImage[] = []

  images.forEach((image) => {
    if (image.nativeFile) {
      uploadImages.push(image)
    } else {
      existingImages.push(image)
    }
  })

  return { uploadImages, existingImages }
}

export const prepareImages = async (images: FormImage[]) => {
  const { uploadImages, existingImages } = splitImages(images)

  let uploadedImgs: FormImage[] = []
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile)
    uploadedImgs = await Medusa.uploads
      .create(files)
      .then(({ data }) => data.uploads)
  }

  return [...existingImages, ...uploadedImgs]
}
