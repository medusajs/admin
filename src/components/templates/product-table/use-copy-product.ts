import { navigate } from "gatsby"
import { useAdminCreateProduct } from "medusa-react"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"

const useCopyProduct = () => {
  const toaster = useToaster()
  const createProduct = useAdminCreateProduct()

  const handleCopyProduct = async (product) => {
    const copy: any = {
      title: `${product.title} copy`,
      description: `${product.description}`,
      handle: `${product.handle}-copy`,
    }

    copy.options = product.options.map((po) => ({
      title: po.title,
    }))

    copy.variants = product.variants.map((pv) => ({
      title: pv.title,
      inventory_quantity: pv.inventory_quantity,
      prices: pv.prices.map((price) => {
        const p = {
          amount: price.amount,
        }
        if (price.region_id) {
          p.region_id = price.region_id
        }
        if (price.currency_code) {
          p.currency_code = price.currency_code
        }

        return p
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

    await createProduct.mutateAsync(copy, {
      onSuccess: ({ product }) => {
        navigate(`/a/products/${product.id}`)
        toaster("Created a new product", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  return handleCopyProduct
}

export default useCopyProduct
