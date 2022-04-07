import { navigate } from "gatsby"
import { useAdminCreatePriceList } from "medusa-react"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

const useCopyPriceList = () => {
  const notification = useNotification()
  const createPriceList = useAdminCreatePriceList()

  const handleCopyPriceList = async (priceList) => {
    const copy: any = {
      name: `${priceList.name} Copy`,
      description: `${priceList.description}`,
      type: priceList.type,
      status: priceList.status,
      starts_at: priceList.starts_at,
      ends_at: priceList.ends_at,
      prices: priceList.prices,
      customer_groups: (priceList.customer_groups || []).map((group) => ({
        id: group.id,
      })),
    }

    if (priceList.prices?.length) {
      copy.prices = priceList.prices.map((price) => {
        const copiedPrice: any = {
          amount: price.amount,
          variant_id: price.variant_id,
          min_quantity: price.min_quantity,
          max_quantity: price.max_quantity,
        }

        if (price.currency_code) {
          copiedPrice.currency_code = price.currency_code
        } else {
          copiedPrice.region_id = price.region_id
        }

        return copiedPrice
      })
    }

    try {
      const data = await createPriceList.mutateAsync(copy)
      navigate(`/a/pricing/${data.price_list.id}`)
      notification("Success", "Successfully copied price list", "success")
    } catch (err) {
      notification("Error", getErrorMessage(err), "error")
    }
  }

  return handleCopyPriceList
}

export default useCopyPriceList
