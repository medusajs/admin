import React, { useState, useEffect } from "react"
import Table from "../../../../components/molecules/table"
import Modal from "../../../../components/molecules/modal"
import CurrencyInput from "../../../../components/organisms/currency-input"
import Button from "../../../../components/fundamentals/button"
import Select from "../../../../components/molecules/select"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"
import { getErrorMessage } from "../../../../utils/error-messages"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import clsx from "clsx"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import { displayAmount } from "../../../../utils/prices"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import Spinner from "../../../../components/atoms/spinner"
import { useAdminShippingOptions } from "medusa-react"

const ReturnMenu = ({ order, onReturn, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [shippingPrice, setShippingPrice] = useState()
  const [shippingMethod, setShippingMethod] = useState()

  const [allItems, setAllItems] = useState([])

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
    }
  }, [order])

  const handleReturnToggle = (item) => {
    const id = item.id
    const idx = toReturn.indexOf(id)
    if (idx !== -1) {
      const newReturns = [...toReturn]
      newReturns.splice(idx, 1)
      setToReturn(newReturns)

      if (returnAll) {
        setReturnAll(false)
      }
    } else {
      const newReturns = [...toReturn, id]
      setToReturn(newReturns)

      const newQuantities = {
        ...quantities,
        [item.id]: item.quantity - item.returned_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  const isLineItemCanceled = (item) => {
    const { swap_id, claim_order_id } = item
    const travFind = (col, id) =>
      col.filter((f) => f.id == id && f.canceled_at).length > 0

    if (swap_id) {
      return travFind(order.swaps, swap_id)
    }
    if (claim_order_id) {
      return travFind(order.claims, claim_order_id)
    }
    return false
  }

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
    const items = toReturn.map((t) => allItems.find((i) => i.id === t))
    const total =
      items.reduce((acc, next) => {
        return (
          acc +
          (next.refundable / (next.quantity - next.returned_quantity)) *
            quantities[next.id]
        )
      }, 0) - (shippingPrice || 0)

    setRefundable(total)

    setRefundAmount(total)
  }, [toReturn, quantities, shippingPrice])

  const handleQuantity = (change, item) => {
    if (
      (item.quantity - item.returned_quantity === quantities[item.id] &&
        change > 0) ||
      (quantities[item.id] === 1 && change < 0)
    ) {
      return
    }
    const newQuantities = {
      ...quantities,
      [item.id]: quantities[item.id] + change,
    }

    setQuantities(newQuantities)
  }

  const onSubmit = () => {
    const items = toReturn.map((t) => ({
      item_id: t,
      quantity: quantities[t],
    }))

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

    if (onReturn) {
      setSubmitting(true)
      return onReturn(data)
        .then(() => onDismiss())
        .then(() => toaster("Successfully returned order", "success"))
        .catch((error) => toaster(getErrorMessage(error), "error"))
        .finally(() => setSubmitting(false))
    }
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
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  const handleRemoveCustomShippingPrice = () => {
    const method = shippingOptions.find((o) => shippingMethod.value === o.id)
    setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    setUseCustomShippingPrice(false)
  }

  const handleUpdateShippingPrice = (value) => {
    if (value >= 0) {
      setShippingPrice(value)
    }
  }

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 class="inter-xlarge-semibold">Request Return</h2>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <div className="mb-7">
            <h3 className="inter-base-semibold">Items to return</h3>
            <Table>
              <Table.HeadRow className="text-grey-50 inter-small-semibold">
                <Table.HeadCell colspan={2}>Product Details</Table.HeadCell>
                <Table.HeadCell className="text-right pr-8">
                  Quantity
                </Table.HeadCell>
                <Table.HeadCell className="text-right">
                  Refundable
                </Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.HeadRow>
              <Table.Body>
                {allItems.map((item) => {
                  // Only show items that have not been returned,
                  // and aren't canceled
                  if (
                    item.returned_quantity === item.quantity ||
                    isLineItemCanceled(item)
                  ) {
                    return
                  }
                  const checked = toReturn.includes(item.id)
                  return (
                    <>
                      <Table.Row
                        className={clsx("border-b-grey-0 hover:bg-grey-0")}
                      >
                        <Table.Cell>
                          <div className="items-center ml-1 h-full flex">
                            <div
                              onClick={() => handleReturnToggle(item)}
                              className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
                                checked && "bg-violet-60"
                              }`}
                            >
                              <span className="self-center">
                                {checked && <CheckIcon size={16} />}
                              </span>
                            </div>

                            <input
                              className="hidden"
                              checked={checked}
                              tabIndex={-1}
                              onChange={() => handleReturnToggle(item)}
                              type="checkbox"
                            />
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="min-w-[240px] flex py-2">
                            <div className="w-[30px] h-[40px] ">
                              <img
                                className="h-full w-full object-cover rounded"
                                src={item.thumbnail}
                              />
                            </div>
                            <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                              <span>
                                <span className="text-grey-90">
                                  {item.title}
                                </span>{" "}
                                test
                              </span>
                              <span>{item.variant.title}</span>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="text-right w-32 pr-8">
                          {toReturn.includes(item.id) ? (
                            <div className="flex w-full text-right justify-end text-grey-50 ">
                              <span
                                onClick={() => handleQuantity(-1, item)}
                                className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2"
                              >
                                <MinusIcon size={16} />
                              </span>
                              <span>{quantities[item.id] || ""}</span>
                              <span
                                onClick={() => handleQuantity(1, item)}
                                className={clsx(
                                  "w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2"
                                )}
                              >
                                <PlusIcon size={16} />
                              </span>
                            </div>
                          ) : (
                            <span className="text-grey-40">
                              {item.quantity - item.returned_quantity}
                            </span>
                          )}
                        </Table.Cell>
                        <Table.Cell className="text-right">
                          {(item.refundable / 100).toFixed(2)}
                        </Table.Cell>
                        <Table.Cell className="text-right text-grey-40 pr-1">
                          {order.currency_code.toUpperCase()}
                        </Table.Cell>
                      </Table.Row>
                      {checked && (
                        <Table.Row className="last:border-b-0 hover:bg-grey-0">
                          <Table.Cell colspan={5}>
                            <div className="w-full flex justify-end">
                              <Button
                                variant="ghost"
                                size="small"
                                className="border border-grey-20"
                              >
                                Select Reason
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </>
                  )
                })}
              </Table.Body>
            </Table>
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
                placeholder={"Add a shipping method"}
                value={shippingMethod}
                onChange={handleShippingSelected}
                options={shippingOptions.map((o) => ({
                  label: o.name,
                  value: o.id,
                }))}
              />
            )}
            {shippingMethod &&
              (useCustomShippingPrice ? (
                <div className="flex items-center">
                  <CurrencyInput
                    readOnly
                    className="mt-4 w-full"
                    size="small"
                    currentCurrency={order.currency_code}
                  >
                    <CurrencyInput.AmountInput
                      label={"Amount"}
                      amount={shippingPrice}
                      onChange={handleUpdateShippingPrice}
                    />
                  </CurrencyInput>
                  <Button
                    onClick={handleRemoveCustomShippingPrice}
                    className="w-8 h-8 ml-8 text-grey-40"
                    variant="ghost"
                    size="small"
                  >
                    <TrashIcon size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex w-full mt-4 justify-end">
                  <Button
                    onClick={() => setUseCustomShippingPrice(true)}
                    variant="ghost"
                    className="border border-grey-20"
                    size="small"
                  >
                    Add custom price
                  </Button>
                </div>
              ))}
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
                  readonly
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
                loading={submitting}
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
    </Modal>
  )
}

export default ReturnMenu
