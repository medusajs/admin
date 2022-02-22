export const formValuesToUpdateGiftCardMapper = (values) => {
  return {
    title: values.title,
    handle: values.handle,
    subtitle: values.subtitle,
    description: values.description,
    thumbnail: values?.images?.length
      ? values.images[values.thumbnail]
      : undefined,

    type: values?.type
      ? { id: values.type.value, value: values.type.label }
      : undefined,
    images: values?.images || [],
    tags: values?.tags ? values.tags.map((tag) => ({ value: tag })) : [],
    // variants: [
    //   {
    //     title: values?.title,
    //     allow_backorder: values.allow_backorders,
    //     manage_inventory: values.manage_inventory,
    //     sku: values?.sku || null,
    //     ean: values?.ean || null,
    //     inventory_quantity: values?.inventory_quantity
    //       ? parseInt(values?.inventory_quantity, 10)
    //       : undefined,
    //     options: [{ value: "Default Variant" }],
    //     prices: values?.prices ? values.prices.map((p) => p.price) : [],
    //     material: values.material,
    //   },
    // ],
  }
}

export const giftCardToFormValuesMapper = (giftCard) => {
  let thumbnail = giftCard?.images.length
    ? giftCard.images.findIndex((img) => img.url)
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
