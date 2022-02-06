export const productToFormValuesMapper = (product) => {
  console.log({ product })
  return {
    ...product,
    collection: product?.collection
      ? { id: product.collection.id, label: product.collection.title }
      : null,
    type: product?.type
      ? { id: product.type.id, label: product.type.value }
      : null,
    images: product?.images?.length
      ? product.images
      : product?.thumbnail
      ? [{ url: product?.thumbnail }]
      : [],
    thumbnail: 0,
    prices: product?.variants.length
      ? product.variants[0].prices.map((price) => ({
          price: { currency_code: price.currency_code, amount: price.amount },
        }))
      : [],
  }
}

export const formValuesToProductMapper = (values) => {
  return {
    title: values.title,
    handle: values.handle,
    status: values.status || "published",
    description: values.description,
    thumbnail: values?.images?.length
      ? values.images[values.thumbnail]
      : values.thumbnail,
    collection_id: values?.collection ? values.collection.value : undefined,
    type: values?.type
      ? { id: values.type.value, value: values.type.label }
      : undefined,
    images: values?.images || [],
    options: [{ title: "Default Option" }],
    tags: values?.tags ? values.tags.map((tag) => ({ value: tag })) : [],
    // TODO: handle addition with multiple variants
    variants: [
      {
        title: values?.title,
        allow_backorder: values.allow_backorders,
        manage_inventory: values.manage_inventory,
        sku: values?.sku,
        ean: values?.ean,
        inventory_quantity: values?.inventory_quantity
          ? parseInt(values?.inventory_quantity, 10)
          : undefined,
        options: [{ value: "Default Variant" }],
        prices: values?.prices ? values.prices.map((p) => p.price) : [],
        material: values.material,
      },
    ],
    width: values?.width ? parseInt(values.width, 10) : undefined,
    length: values?.length ? parseInt(values.length, 10) : undefined,
    weight: values?.weight ? parseInt(values.weight, 10) : undefined,
    height: values?.height ? parseInt(values.height, 10) : undefined,
    origin_country: values.origin_country,
    mid_code: values.mid_code,
    hs_code: values.hs_code,
    is_giftcard: false,
    discountable: true,
  }
}
