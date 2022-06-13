import { AdminPostProductsProductReq, Product } from "@medusajs/medusa"
import { prepareImages } from "../../../products/product-form/utils/helpers"
import { MangeGiftCardFormData } from "../utils/types"

export const formValuesToUpdateGiftCardMapper = async (
  values: MangeGiftCardFormData
): Promise<AdminPostProductsProductReq> => {
  const imagePayload = {} as Pick<
    AdminPostProductsProductReq,
    "images" | "thumbnail"
  >

  if (values.images?.length) {
    const images = await prepareImages(values.images)
    imagePayload.images = images.map((img) => img.url)
  }

  if (values.thumbnail) {
    imagePayload.thumbnail = imagePayload.images?.length
      ? imagePayload.images[values.thumbnail]
      : undefined
  }

  return {
    title: values.title,
    subtitle: values.subtitle ?? undefined,
    description: values.description ?? undefined,
    type: values.type
      ? { id: values.type?.value, value: values.type.label }
      : undefined,
    tags: values.tags?.map((tag) => ({ value: tag })) ?? [],
    ...imagePayload,
  }
}

export const giftCardToFormValuesMapper = (
  giftCard: Product
): MangeGiftCardFormData => {
  let thumbnail = giftCard.images?.length
    ? giftCard.images.findIndex((img) => img.url === giftCard.thumbnail)
    : 0
  thumbnail = thumbnail === -1 ? 0 : thumbnail

  return {
    title: giftCard.title,
    subtitle: giftCard.subtitle,
    description: giftCard.description,
    type: giftCard.type
      ? { label: giftCard.type.value, value: giftCard.type.id }
      : null,
    tags: giftCard.tags.map((t) => t.value),
    images: giftCard.images.map((img) => ({ url: img.url })),
    thumbnail,
  }
}
