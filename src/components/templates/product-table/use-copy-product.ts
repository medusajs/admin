import { AdminPostProductsReq, Product } from "@medusajs/medusa"
import { omit } from "lodash"
import { useAdminCreateProduct } from "medusa-react"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import useNotification from "../../../hooks/use-notification"
import { ProductStatus } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"

const useCopyProduct = () => {
  const navigate = useNavigate()
  const notification = useNotification()
  const { mutate } = useAdminCreateProduct()

  const handleCopyProduct = (product: Product) => {
    const {
      variants,
      options,
      type,
      tags,
      images,
      collection_id,
      collection,
      sales_channels,
      title,
      handle,
      ...rest
    } = omit(product, [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "external_id",
      "profile_id",
      "profile",
      "type_id",
      "status",
    ])

    const base: Partial<AdminPostProductsReq> = Object.entries(rest).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value
        }

        return acc
      },
      {} as Partial<AdminPostProductsReq>
    )

    if (variants && variants.length) {
      const copiedVariants: AdminPostProductsReq["variants"] = []

      variants.forEach((variant) => {
        const { prices, options, ...rest } = omit(variant, [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "product",
          "product_id",
          "variant_rank",
        ])

        const variantBase = Object.entries(rest).reduce((acc, [key, value]) => {
          if (value) {
            acc[key] = value
          }

          return acc
        }, {} as NonNullable<AdminPostProductsReq["variants"]>[0])

        if (prices && prices.length) {
          variantBase.prices = prices.map((price) => ({
            amount: price.amount,
            currency_code: !price.region_id ? price.currency_code : undefined,
            region_id: price.region_id,
          }))
        }

        if (options && options.length) {
          variantBase.options = options.map((option) => ({
            value: option.value,
          }))
        }

        copiedVariants.push(variantBase)
      })

      base.variants = copiedVariants
    }

    if (options && options.length) {
      base.options = options.map((option) => ({
        title: option.title,
      }))
    }

    if (images && images.length) {
      base.images = images.map((image) => image.url)
    }

    if (collection) {
      base.collection_id = collection.id
    } else if (collection_id) {
      base.collection_id = collection_id
    }

    if (sales_channels && sales_channels.length) {
      base.sales_channels = sales_channels.map((channel) => ({
        id: channel.id,
      }))
    }

    if (tags && tags.length) {
      base.tags = tags.map(({ id, value }) => ({ id, value }))
    }

    if (type) {
      base.type = {
        id: product.type.id,
        value: product.type.value,
      }
    }

    base.status = ProductStatus.DRAFT

    // Allows the user to duplicate the same product multiple times without having to rename and change the handle of the copies
    const uuid = v4().slice(-5)

    base.title = `${title} (COPY-${uuid})`
    base.handle = `${handle}-${uuid}`

    mutate(base as AdminPostProductsReq, {
      onSuccess: ({ product: copiedProduct }) => {
        navigate(`/a/products/${copiedProduct.id}`)
        notification("Success", "Created a new product", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return handleCopyProduct
}

export default useCopyProduct
