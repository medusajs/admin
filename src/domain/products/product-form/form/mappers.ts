import { SINGLE_PRODUCT_VIEW } from "./product-form-context"

export const productToFormValuesMapper = (product) => {
  let thumbnail = product?.images?.length
    ? product.images.findIndex((img) => img.url === product.thumbnail)
    : 0
  thumbnail = thumbnail === -1 ? 0 : thumbnail

  return {
    ...product,
    collection: product?.collection
      ? { value: product.collection.id, label: product.collection.title }
      : null,
    type: product?.type
      ? { value: product.type.id, label: product.type.value }
      : null,
    tags: product?.tags ? product.tags.map((t) => t.value) : [],
    images: product?.images?.length
      ? product.images
      : product?.thumbnail
      ? [{ url: product?.thumbnail }]
      : [],
    thumbnail,
    origin_country: product?.origin_country
      ? {
          value: product.origin_country,
          label: product.origin_country,
        }
      : null,
    variants: product.variants,
    prices: product?.variants.length
      ? product.variants[0].prices.map((price) => ({
          price: { currency_code: price.currency_code, amount: price.amount },
        }))
      : [],
  }
}

export const formValuesToCreateProductMapper = (
  values,
  viewType,
  isFeatureEnabled
) => {
  const scData = {}

  if (isFeatureEnabled("sales_channels")) {
    scData["sales_channels"] = values.sales_channels.map((salesChannel) => ({
      id: salesChannel.id,
    }))
  }

  // Simple product
  if (viewType === SINGLE_PRODUCT_VIEW) {
    values.variants = [
      {
        title: values?.title,
        allow_backorder: values.allow_backorder,
        manage_inventory: values.manage_inventory,
        sku: values?.sku || null,
        ean: values?.ean || null,
        inventory_quantity: values?.inventory_quantity
          ? parseInt(values?.inventory_quantity, 10)
          : 0,
        options: [{ value: "Default Variant" }],
        prices: values?.prices ? values.prices.map((p) => p.price) : [],
        material: values.material,
      },
    ]
    values.options = [{ title: "Default Option" }]
  } else {
    // Product with variants
    values.variants = values?.variants.map((v) => ({
      title: v.title,
      sku: v.sku || null,
      ean: v.ean || null,
      inventory_quantity: v?.inventory_quantity
        ? parseInt(v?.inventory_quantity, 10)
        : 0,
      prices: [],
      options: v.options.map((o) => ({ value: o })),
    }))
    values.options = values.options.map((o) => ({ title: o.name }))
  }

  return {
    title: values.title,
    handle: values.handle,
    status: values.status || "published",
    description: values.description,
    thumbnail: values?.images?.length
      ? values.images[values.thumbnail]
      : undefined,
    collection_id: values?.collection ? values.collection.value : undefined,
    type: values?.type
      ? { id: values.type.value, value: values.type.label }
      : undefined,
    images: values?.images || [],
    options: values.options,
    tags: values?.tags ? values.tags.map((tag) => ({ value: tag })) : [],
    variants: values.variants,
    width: values?.width ? parseInt(values.width, 10) : undefined,
    length: values?.length ? parseInt(values.length, 10) : undefined,
    weight: values?.weight ? parseInt(values.weight, 10) : undefined,
    height: values?.height ? parseInt(values.height, 10) : undefined,
    origin_country: values.origin_country?.value,
    mid_code: values.mid_code,
    hs_code: values.hs_code,
    is_giftcard: false,
    discountable: values.discountable,
    ...scData,
  }
}

export const formValuesToUpdateProductMapper = (values, isFeatureEnabled) => {
  const scData = {}

  if (isFeatureEnabled("sales_channels")) {
    scData["sales_channels"] = values.sales_channels.map((salesChannel) => ({
      id: salesChannel.id,
    }))
  }

  return {
    title: values.title,
    handle: values.handle,
    status: values.status,
    description: values.description,
    thumbnail: values.images.length ? values.images[values.thumbnail] : null,
    collection_id: values?.collection ? values.collection.value : null,
    type: values?.type
      ? { id: values.type.value, value: values.type.label }
      : undefined,
    images: values?.images || [],
    tags: values?.tags ? values.tags.map((tag) => ({ value: tag })) : [],
    width: values?.width ? parseInt(values.width, 10) : undefined,
    length: values?.length ? parseInt(values.length, 10) : undefined,
    weight: values?.weight ? parseInt(values.weight, 10) : undefined,
    height: values?.height ? parseInt(values.height, 10) : undefined,
    origin_country: values.origin_country?.value,
    mid_code: values.mid_code,
    hs_code: values.hs_code,
    discountable: values.discountable,
    ...scData,
  }
}
