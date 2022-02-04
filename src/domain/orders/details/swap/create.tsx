import React, { useState, useEffect, useContext } from "react"
import Modal from "../../../../components/molecules/modal"
import Button from "../../../../components/fundamentals/button"
import Select from "../../../../components/molecules/select"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"
import { getErrorMessage } from "../../../../utils/error-messages"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import Spinner from "../../../../components/atoms/spinner"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import RMAReturnProductsTable from "../../../../components/organisms/rma-return-product-table"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import RMASelectProductSubModal from "../rma-sub-modals/products"

const removeNullish = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const extractPrice = (prices, order) => {
  let price = prices.find((ma) => ma.region_id === order.region_id)

  if (!price) {
    price = prices.find((ma) => ma.currency_code === order.currency_code)
  }

  if (price) {
    return (price.amount * (1 + order.tax_rate / 100)) / 100
  }

  return 0
}

const SwapMenu = ({ order, onCreate, onDismiss, toaster }) => {
  const layeredModalContext = useContext(LayeredModalContext)
  const [submitting, setSubmitting] = useState(false)
  const [toPay, setToPay] = useState(0)
  const [toReturn, setToReturn] = useState({})
  // const [quantities, setQuantities] = useState({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [itemsToAdd, setItemsToAdd] = useState([])
  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [noNotification, setNoNotification] = useState(order.no_notification)

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState([])

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
    }
  }, [order])

  useEffect(() => {
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: true,
      })
      .then(({ data }) => {
        setShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    const items = Object.keys(toReturn).map((t) =>
      allItems.find((i) => i.id === t)
    )

    const returnTotal =
      items.reduce((acc, next) => {
        return (
          acc +
          (next.refundable / (next.quantity - next.returned_quantity)) *
            toReturn[next.id].quantity
        )
      }, 0) - (shippingPrice || 0)

    const newItemsTotal = itemsToAdd.reduce((acc, next) => {
      const price = extractPrice(next.prices, order)
      const lineTotal = price * 100 * next.quantity
      return acc + lineTotal
    }, 0)

    setToPay(newItemsTotal - returnTotal)
  }, [toReturn, shippingPrice, itemsToAdd])

  const handleToAddQuantity = (value, index) => {
    const updated = [...itemsToAdd]
    updated[index] = {
      ...itemsToAdd[index],
      quantity: itemsToAdd[index].quantity + value,
    }

    setItemsToAdd(updated)
  }

  const handleRemoveItem = (index) => {
    const updated = [...itemsToAdd]
    updated.splice(index, 1)
    setItemsToAdd(updated)
  }

  const handleShippingSelected = (selectedItem) => {
    if (selectedItem.value !== "Add a shipping method") {
      setShippingMethod(selectedItem)
      const method = shippingOptions.find((o) => selectedItem.value === o.id)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  const handleUpdateShippingPrice = (value) => {
    if (value >= 0) {
      setShippingPrice(value)
    }
  }

  useEffect(() => {
    if (!useCustomShippingPrice && shippingMethod && shippingOptions) {
      const method = shippingOptions.find((o) => shippingMethod.value === o.id)
      console.log(shippingMethod, method)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    }
  }, [useCustomShippingPrice, shippingMethod])

  const handleProductSelect = (variants) => {
    setItemsToAdd((itemsToAdd) => [
      ...itemsToAdd,
      ...variants
        .filter((variant) => itemsToAdd.indexOf((v) => v.id === variant.id) < 0)
        .map((variant) => ({ ...variant, quantity: 1 })),
    ])
  }

  const onSubmit = () => {
    const items = Object.entries(toReturn).map(([key, value]) => {
      const clean = removeNullish(value)
      return {
        item_id: key,
        ...clean,
      }
    })

    const data = {
      return_items: items,
      additional_items: itemsToAdd.map((i) => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod.value,
        price: Math.round(shippingPrice / (1 + order.tax_rate / 100)),
      }
    }

    if (onCreate) {
      setSubmitting(true)
      return onCreate(data)
        .then(() => onDismiss())
        .then(() => toaster("Successfully created swap", "success"))
        .catch((error) => toaster(getErrorMessage(error), "error"))
        .finally(() => setSubmitting(false))
    }
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Register Exchange</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-7">
            <h3 className="inter-base-semibold">Items to return</h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
            />
          </div>

          <div>
            <h3 className="inter-base-semibold ">Shipping</h3>
            {shippingLoading ? (
              <div className="flex justify-center">
                <Spinner size="medium" variant="secondary" />
              </div>
            ) : (
              <Select
                label="Shipping Method"
                className="mt-2"
                overrideStrings={{ search: "Add a shipping method" }}
                value={shippingMethod}
                onChange={handleShippingSelected}
                options={shippingOptions.map((o) => ({
                  label: o.name,
                  value: o.id,
                }))}
              />
            )}
            {shippingMethod && (
              <RMAShippingPrice
                useCustomShippingPrice={useCustomShippingPrice}
                shippingPrice={shippingPrice}
                currency_code={order.currency_code}
                updateShippingPrice={handleUpdateShippingPrice}
                setUseCustomShippingPrice={setUseCustomShippingPrice}
              />
            )}
          </div>
          <div className="flex justify-between mt-8 items-center">
            <h3 className="inter-base-semibold ">Items to send</h3>
            {itemsToAdd.length === 0 ? (
              <Button
                variant="ghost"
                className="border border-grey-20"
                size="small"
                onClick={() => {
                  layeredModalContext.push(
                    SelectProductsScreen(
                      layeredModalContext.pop,
                      itemsToAdd,
                      handleProductSelect
                    )
                  )
                }}
              >
                Add Product
              </Button>
            ) : (
              <></>
            )}
          </div>
          {itemsToAdd.length > 0 && (
            <>
              <RMAReturnProductsTable
                order={order}
                itemsToAdd={itemsToAdd}
                handleRemoveItem={handleRemoveItem}
                handleToAddQuantity={handleToAddQuantity}
              />

              <div className="flex w-full justify-end">
                <Button
                  variant="ghost"
                  className="border border-grey-20"
                  size="small"
                  onClick={() => {
                    layeredModalContext.push(
                      SelectProductsScreen(
                        layeredModalContext.pop,
                        itemsToAdd,
                        handleProductSelect
                      )
                    )
                  }}
                >
                  Add Product
                </Button>
              </div>
            </>
          )}
          <div className="flex justify-between items-center inter-base-semibold mt-8">
            <span>Difference</span>
            <span className="inter-large-semibold">
              {(toPay / 100).toFixed(2)} {order.currency_code.toUpperCase()}
            </span>
          </div>
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
          <div className="flex w-full justify-between">
            <div
              className="items-center h-full flex cursor-pointer"
              onClick={() => setNoNotification(!noNotification)}
            >
              <div
                className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                  !noNotification && "bg-violet-60"
                }`}
              >
                <span className="self-center">
                  {!noNotification && <CheckIcon size={16} />}
                </span>
              </div>
              <input
                id="noNotification"
                className="hidden"
                name="noNotification"
                checked={!noNotification}
                type="checkbox"
              />
              <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                Send notifications
                <InfoTooltip content="Notify customer of created return" />
              </span>
            </div>

            <Button
              onClick={onSubmit}
              disabled={toReturn.length === 0 || itemsToAdd.length === 0}
              loading={submitting}
              type="submit"
              variant="primary"
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const SelectProductsScreen = (pop, itemsToAdd, setSelectedItems) => {
  return {
    title: "Add Products",
    onBack: () => pop(),
    view: (
      <RMASelectProductSubModal
        selectedItems={itemsToAdd || []}
        onSubmit={setSelectedItems}
      />
    ),
  }
}

export default SwapMenu
