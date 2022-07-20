import {
  AdminPostProductsProductReq,
  AdminPostProductsReq,
  Product,
} from "@medusajs/medusa"
import { ProductStatus } from "../../../../types/shared"
import { PRODUCT_VIEW } from "../utils/constants"
import { getVariantTitle, prepareImages } from "../utils/helpers"
import { ProductFormValues } from "../utils/types"

export const productToFormValuesMapper = (
  product: Product
): ProductFormValues => {
  let thumbnail = product?.images?.length
    ? product.images.findIndex((img) => img.url === product.thumbnail)
    : 0
  thumbnail = thumbnail === -1 ? 0 : thumbnail

  return {
    title: product.title,
    handle: product.handle,
    description: product.description,
    thumbnail,
    images: product.images.map((i) => ({ url: i.url })),
    collection: product.collection
      ? { value: product.collection.id, label: product.collection.title }
      : null,
    type: product.type
      ? { value: product.type.id, label: product.type.value }
      : null,
    tags: product.tags ? product.tags.map((t) => t.value) : [],
    status: (product.status as unknown) as ProductStatus,
    variants: product.variants.map((v) => ({
      ean: v.ean,
      inventory_quantity: v.inventory_quantity,
      allow_backorder: v.allow_backorder,
      manage_inventory: v.manage_inventory,
      sku: v.sku,
      title: v.title,
      options: v.options.map((o) => ({
        value: o.value,
        label: o.value,
      })),
    })),
    options: product.options.map((o) => ({
      name: o.title,
      values: o.values?.map((ov) => ov.value),
    })),
    inventory_quantity: null,
    discountable: product.discountable,
    mid_code: product.mid_code,
    hs_code: product.hs_code,
    origin_country: product?.origin_country
      ? {
          value: product.origin_country,
          label: product.origin_country,
        }
      : null,
    material: product.material,
    height: product.height,
    length: product.length,
    weight: product.weight,
    width: product.width,
  }
}

export const formValuesToCreateProductMapper = async (
  values: ProductFormValues,
  viewType: PRODUCT_VIEW
): Promise<AdminPostProductsReq> => {
  const payload = {} as Pick<
    AdminPostProductsReq,
    "options" | "variants" | "images" | "thumbnail"
  >

  // Simple product
  if (viewType === PRODUCT_VIEW.SINGLE_PRODUCT_VIEW) {
    payload.variants = [
      {
        title: values.title,
        allow_backorder: values.allow_backorder,
        manage_inventory: values.manage_inventory,
        sku: values.sku && values.sku !== "" ? values.sku : undefined,
        ean: values.ean && values.ean !== "" ? values.ean : undefined,
        inventory_quantity: values.inventory_quantity
          ? values.inventory_quantity
          : 0,
        options: [{ value: "Default Variant" }],
        prices: values?.prices ? values.prices.map((p) => p.price) : [],
        material: values.material ?? undefined,
      },
    ]
    payload.options = [{ title: "Default Option" }]
  } else {
    // Product with variants
    payload.variants = values.variants?.map((v) => ({
      title: getVariantTitle(v),
      sku: v.sku ?? undefined,
      ean: v.ean ?? undefined,
      inventory_quantity: v.inventory_quantity ?? 0,
      prices: [],
      options: v.options.map((o) => ({ value: o.value })),
    }))

    payload.options = values.options.map((o) => ({ title: o.name }))
  }

  if (values.images?.length) {
    const images = await prepareImages(values.images)
    payload.images = images.map((img) => img.url)
  }

  if (values.thumbnail) {
    payload.thumbnail = payload.images?.length
      ? payload.images[values.thumbnail]
      : undefined
  }

  return {
    title: values.title,
    handle: values.handle ?? undefined,
    status: values.status ?? ProductStatus.PUBLISHED,
    description: values.description ?? undefined,
    collection_id: values?.collection ? values.collection.value : undefined,
    type: values?.type
      ? { id: values.type.value, value: values.type.label }
      : undefined,
    tags: values?.tags ? values.tags.map((tag) => ({ value: tag })) : [],
    width: values.width ?? undefined,
    length: values.length ?? undefined,
    weight: values.weight ?? undefined,
    height: values.height ?? undefined,
    origin_country: values.origin_country?.value,
    mid_code: values.mid_code ?? undefined,
    hs_code: values.hs_code ?? undefined,
    is_giftcard: false,
    discountable: values.discountable,
    ...payload,
  }
}

export const formValuesToUpdateProductMapper = async (
  values: ProductFormValues
): Promise<AdminPostProductsProductReq> => {
  const payload = {} as Pick<
    AdminPostProductsProductReq,
    "images" | "thumbnail"
  >

  if (values.images?.length) {
    const images = await prepareImages(values.images)
    payload.images = images.map((img) => img.url)
  } else {
    payload.images = []
  }

  if (values.thumbnail !== null && values.images) {
    payload.thumbnail = payload.images?.length
      ? payload.images[values.thumbnail]
      : undefined
  }

  return {
    title: values.title,
    handle: values.handle,
    status: values.status,
    description: values.description,
    thumbnail:
      values.images.length && values.thumbnail
        ? values.images[values.thumbnail]
        : null,
    collection_id: values?.collection ? values.collection.value : null,
    type: values.type?.value
      ? { id: values.type.value, value: values.type.label }
      : undefined,
    tags: values.tags?.map((tag) => ({ value: tag })) ?? [],
    width: values.width ?? undefined,
    length: values.length ?? undefined,
    weight: values.weight ?? undefined,
    height: values.height ?? undefined,
    origin_country: values.origin_country?.value,
    mid_code: values.mid_code ?? undefined,
    hs_code: values.hs_code ?? undefined,
    discountable: values.discountable,
    ...payload,
  }
}
