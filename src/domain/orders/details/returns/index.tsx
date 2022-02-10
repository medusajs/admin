import { useAdminRequestReturn, useAdminShippingOptions } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import { getErrorMessage } from "../../../../utils/error-messages"
import { displayAmount } from "../../../../utils/prices"
import { removeNullish } from "../../../../utils/remove-nullish"
import { filterItems } from "../utils/create-filtering"

const ReturnMenu = ({ order, onDismiss, notification }) => {
  const layoutmodalcontext = useContext(LayeredModalContext)

  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState({})
  const [quantities, setQuantities] = useState({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [shippingPrice, setShippingPrice] = useState<number>()
  const [shippingMethod, setShippingMethod] = useState(null)

  const [allItems, setAllItems] = useState<any[]>([])

  const requestReturnOrder = useAdminRequestReturn(order.id)

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
    }
  }, [order])

  const {
    isLoading: shippingLoading,
    shipping_options: shippingOptions,
  } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: "true",
  })

  useEffect(() => {
    const items = Object.keys(toReturn).map((t) =>
      allItems.find((i) => i.id === t)
    )
    const total =
      items.reduce((acc, next) => {
        return (
          acc +
          (next.refundable / (next.quantity - next.returned_quantity)) *
            toReturn[next.id].quantity
        )
      }, 0) - (shippingPrice || 0)

    setRefundable(total)

    setRefundAmount(total)
  }, [toReturn, quantities, shippingPrice])

  const onSubmit = async () => {
    const items = Object.entries(toReturn).map(([key, value]) => {
      const toSet = {
        reason_id: value.reason?.value.id,
        ...value,
      }
      delete toSet.reason
      const clean = removeNullish(toSet)
      return {
        item_id: key,
        ...clean,
      }
    })

    const data = {
      items,
      refund: Math.round(refundAmount),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod.value,
        price: shippingPrice / (1 + order.tax_rate / 100),
      }
    }

    setSubmitting(true)
    return requestReturnOrder
      .mutateAsync(data)
      .then(() => onDismiss())
      .then(() =>
        notification("Success", "Successfully returned order", "success")
      )
      .catch((error) => notification("Error", getErrorMessage(error), "error"))
      .finally(() => setSubmitting(false))
  }

  const handleRefundUpdated = (value) => {
    if (value < order.refundable_amount && value >= 0) {
      setRefundAmount(value)
    }
  }

  const handleShippingSelected = (selectedItem) => {
    if (selectedItem.value !== "Add a shipping method") {
      setShippingMethod(selectedItem)
      const method = shippingOptions.find((o) => selectedItem.value === o.id)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod(null)
      setShippingPrice(0)
    }
  }

  useEffect(() => {
    if (!useCustomShippingPrice && shippingMethod) {
      const method = shippingOptions.find((o) => shippingMethod.value === o.id)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    }
  }, [useCustomShippingPrice, shippingMethod])

  const handleUpdateShippingPrice = (value) => {
    if (value >= 0) {
      setShippingPrice(value)
    }
  }

  return (
    <LayeredModal context={layoutmodalcontext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Request Return</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-7">
            <h3 className="inter-base-semibold">Items to return</h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
              quantities={quantities}
              setQuantities={setQuantities}
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

          {refundable >= 0 && (
            <div className="mt-10">
              {!useCustomShippingPrice && shippingMethod && (
                <div className="flex mb-4 inter-small-regular justify-between">
                  <span>Shipping</span>
                  <div>
                    {displayAmount(order.currency_code, shippingPrice)}{" "}
                    <span className="text-grey-40 ml-3">
                      {order.currency_code.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex inter-base-semibold justify-between w-full">
                <span>Total Refund</span>
                <div className="flex items-center">
                  {!refundEdited && (
                    <>
                      <span
                        className="mr-2 cursor-pointer text-grey-40"
                        onClick={() => setRefundEdited(true)}
                      >
                        <EditIcon size={20} />{" "}
                      </span>
                      {`${displayAmount(
                        order.currency_code,
                        refundAmount
                      )} ${order.currency_code.toUpperCase()}`}
                    </>
                  )}
                </div>
              </div>
              {refundEdited && (
                <CurrencyInput
                  className="mt-2"
                  size="small"
                  currentCurrency={order.currency_code}
                  readOnly
                >
                  <CurrencyInput.AmountInput
                    label={"Amount"}
                    amount={refundAmount}
                    onChange={handleRefundUpdated}
                  />
                </CurrencyInput>
              )}
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
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
                onChange={() => setNoNotification(!noNotification)}
                type="checkbox"
              />
              <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                Send notifications
                <InfoTooltip content="Notify customer of created return" />
              </span>
            </div>
            <div className="flex gap-x-xsmall">
              <Button
                onClick={() => onDismiss()}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="ghost"
              >
                Back
              </Button>
              <Button
                onClick={onSubmit}
                loading={submitting}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="primary"
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default ReturnMenu
