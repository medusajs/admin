import { navigate } from "gatsby"
import _ from "lodash"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { LayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import SteppedModal, {
  SteppedContext,
} from "../../../components/molecules/modal/stepped-modal"
import useMedusa from "../../../hooks/use-medusa"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import { extractUnitPrice } from "../../../utils/prices"
import { removeNullish } from "../../../utils/remove-nullish"
import Billing from "./components/billing-details"
import Items from "./components/items"
import SelectRegionScreen from "./components/select-region"
import SelectShippingMethod from "./components/select-shipping"
import ShippingDetails from "./components/shipping-details"
import Summary from "./components/summary"

const defaultFormValues = {
  region: null,
  shipping: null,
  billing: null,
  email: "",
  customerId: "",
  customer: null,
  shippingOption: null,
  requireShipping: true,
  total: 0,
}

const NewOrder = ({ onDismiss, refresh }) => {
  const [searchResults, setSearchResults] = useState([])
  const [customerAddresses, setCustomerAddresses] = useState([])
  const [items, setItems] = useState([])
  const [shippingOptions, setShippingOptions] = useState([])
  const [customOptionPrice, setCustomOptionPrice] = useState()
  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [noNotification, setNoNotification] = useState(false)
  const [searchingProducts, setSearchingProducts] = useState(false)

  const notification = useNotification()

  const steppedContext = React.useContext(SteppedContext)
  const layeredContext = React.useContext(LayeredModalContext)

  const form = useForm({
    shouldUnregister: false,
    defaultValues: defaultFormValues,
  })

  const {
    shipping,
    billing,
    discount,
    email,
    customerId,
    region,
    shippingOption,
    requireShipping,
  } = form.watch()

  const { regions } = useMedusa("regions")

  const addCustomItem = ({ title, unit_price, quantity }) => {
    const item = { title, unit_price, quantity: quantity || 1 }
    setItems([...items, item])
  }

  const handleAddItems = (variants) => {
    setItems((items) => [
      ...items,
      ...variants
        .filter((variant) => items.indexOf((v) => v.id === variant.id) < 0)
        .map((variant) => ({ ...variant, quantity: 1 })),
    ])
  }

  const handlePriceChange = (price, index) => {
    const value = Math.round(price * 100)

    const updated = [...items]
    updated[index] = {
      ...items[index],
      unit_price: value,
    }

    setItems(updated)
  }

  const handleAddQuantity = (quantity, index) => {
    if (quantity < 0) {
      return
    }

    const updated = [...items]
    updated[index] = {
      ...items[index],
      quantity,
    }

    setItems(updated)
  }

  const handleRemoveItem = (index) => {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  const fetchShippingOptions = async (region) => {
    try {
      const { data } = await Medusa.shippingOptions.list({
        region_id: region.id,
        is_return: false,
      })

      setShippingOptions(data.shipping_options)
      return data.shipping_options
    } catch (error) {
      throw Error("Could not fetch shipping options")
    }
  }

  const getValidShippingOptions = () => {
    const options = shippingOptions

    const total = calculateTotal()

    return options.reduce((acc, next) => {
      if (next.requirements) {
        const minSubtotal = next.requirements.find(
          (req) => req.type === "min_subtotal"
        )

        if (minSubtotal) {
          if (total <= minSubtotal.amount) {
            return acc
          }
        }

        const maxSubtotal = next.requirements.find(
          (req) => req.type === "max_subtotal"
        )
        if (maxSubtotal) {
          if (total >= maxSubtotal.amount) {
            return acc
          }
        }
      }

      acc.push(next)
      return acc
    }, [])
  }

  const submit = async () => {
    const doItems = items.map((i) => {
      const obj = {
        variant_id: i.id || "",
        quantity: i.quantity,
        title: i.title,
      }

      if (i.unit_price) {
        obj.unit_price = i.unit_price
      }

      return obj
    })

    const draftOrder = {
      region_id: region.id,
      items: doItems,
      email,
    }

    if (customerId) {
      draftOrder.customer_id = customerId
    }

    if ("id" in billing) {
      draftOrder.billing_address = billing.id
    } else {
      draftOrder.billing_address = removeNullish(billing)
    }

    if (!_.isEmpty(shipping)) {
      if ("id" in shipping) {
        draftOrder.shipping_address = shipping.id
      } else {
        draftOrder.shipping_address = removeNullish(shipping)
      }
    }

    if (discount && discount.code) {
      draftOrder.discounts = [{ code: discount.code }]
    }

    const option = {
      option_id: shippingOption.id,
      data: shippingOption.data,
    }

    if (customOptionPrice && showCustomPrice) {
      option.price = customOptionPrice * 100
    }

    if (noNotification) {
      draftOrder.no_notification_order = true
    }

    draftOrder.shipping_methods = [option]

    setCreatingOrder(true)
    try {
      const { data } = await Medusa.draftOrders.create(draftOrder)
      navigate(`/a/draft-orders/${data.draft_order.id}`)
      onDismiss()
    } catch (error) {
      notification("Error", "Something went wrong. Please try again", "error")
    }

    setCreatingOrder(false)
  }

  const handleRegionSelect = (regionOption) => {
    form.setValue("region", regionOption?.value)

    fetchShippingOptions(regionOption?.value)
  }

  const handleOptionSelect = (so) => {
    const selectSo = shippingOptions?.find((s) => so.value === s.id)
    form.setValue("shippingOption", selectSo)
  }

  const calculateTotal = () => {
    const tot = items.reduce((acc, next) => {
      if ("unit_price" in next) {
        acc = acc + next.unit_price * next.quantity
      } else {
        acc = acc + extractUnitPrice(next, region, false) * next.quantity
      }

      return acc
    }, 0)

    return tot
  }

  useEffect(() => {
    if (regions) {
      form.setValue("region", regions[0])
    }
  }, [])

  return (
    <SteppedModal
      layeredContext={layeredContext}
      context={steppedContext}
      onSubmit={() => submit()}
      steps={[
        <SelectRegionScreen
          handleRegionSelect={handleRegionSelect}
          region={region}
          options={
            regions?.map((r) => ({
              value: r,
              label: r.name,
            })) || []
          }
        />,
        <Items
          items={items}
          handleAddItems={handleAddItems}
          handleAddQuantity={handleAddQuantity}
          handleRemoveItem={handleRemoveItem}
          handleAddCustom={addCustomItem}
          selectedRegion={region}
          handlePriceChange={handlePriceChange}
        />,
        <SelectShippingMethod
          shippingOptions={getValidShippingOptions()}
          handleOptionSelect={handleOptionSelect}
          region={region}
          shippingOption={shippingOption}
          showCustomPrice={showCustomPrice}
          setShowCustomPrice={setShowCustomPrice}
          setCustomOptionPrice={setCustomOptionPrice}
          customOptionPrice={customOptionPrice}
        />,
        <ShippingDetails
          form={form}
          region={region}
          customerAddresses={customerAddresses}
          setCustomerAddresses={setCustomerAddresses}
        />,

        <Billing form={form} region={region} />,
        <Summary
          items={items}
          showCustomPrice={showCustomPrice}
          customOptionPrice={customOptionPrice}
          form={form}
        />,
      ]}
      lastScreenIsSummary={true}
      title={"Create Draft Order"}
      handleClose={onDismiss}
    />
  )
}

export default NewOrder
