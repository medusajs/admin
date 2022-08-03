import { AdminPostProductsReq, Product } from "@medusajs/medusa"
import { navigate } from "gatsby"
import { useAdminCreateProduct } from "medusa-react"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

const useCopyProduct = () => {
  const notification = useNotification()
  const { mutate } = useAdminCreateProduct()

  const handleCopyProduct = (product: Product) => {
    const copy: AdminPostProductsReq = {
      title: `${product.title} copy`,
      description: product.description || undefined,
      handle: `${product.handle}-copy`,
      is_giftcard: product.is_giftcard,
      discountable: product.discountable,
    }

    copy.options = product.options.map((po) => ({
      title: po.title,
    }))

    copy.variants = product.variants.map((pv) => ({
      title: pv.title,
      inventory_quantity: pv.inventory_quantity,
      prices: pv.prices.map((p) => {
        return {
          amount: p.amount,
          currency_code: p.currency_code,
          region_id: p.region_id,
        }
      }),
      options: pv.options.map((pvo) => ({ value: pvo.value })),
    }))

    if (product.type) {
      copy.type = {
        id: product.type.id,
        value: product.type.value,
      }
    }

    if (product.collection_id) {
      copy.collection_id = product.collection_id
    }

    if (product.tags) {
      copy.tags = product.tags.map(({ id, value }) => ({ id, value }))
    }

    if (product.thumbnail) {
      copy.thumbnail = product.thumbnail
    }

    mutate(copy, {
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
