export const formValuesToUpdateGiftCardMapper = (values) => {
  const payload = {
    ...values,
    thumbnail: values.images?.length ? values.images[values.thumbnail] : null,
  }

  if (values.images) {
    payload["images"] = values.images
  }

  if (values.type) {
    payload["type"] = { id: values.type.value, value: values.type.label }
  }

  if (values.tags) {
    payload["tags"] = values.tags.map((tag) => ({ value: tag }))
  }

  return payload
}

export const giftCardToFormValuesMapper = (giftCard) => {
  let thumbnail = giftCard?.images?.length
    ? giftCard.images.findIndex((img) => img.url === giftCard.thumbnail)
    : 0
  thumbnail = thumbnail === -1 ? 0 : thumbnail
  return {
    ...giftCard,
    type: giftCard?.type
      ? { id: giftCard.type.id, label: giftCard.type.value }
      : null,
    tags: giftCard?.tags ? giftCard.tags.map((t) => t.value) : [],
    images: giftCard?.images?.length
      ? giftCard.images
      : giftCard?.thumbnail
      ? [{ url: giftCard?.thumbnail }]
      : [],
    thumbnail,
    prices: giftCard?.variants.length
      ? giftCard.variants[0].prices.map((price) => ({
          price: { currency_code: price.currency_code, amount: price.amount },
        }))
      : [],
  }
}
