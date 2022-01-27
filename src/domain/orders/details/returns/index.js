import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm } from "react-hook-form"

import Table from "../../../../components/molecules/table"
import Modal from "../../../../components/molecules/modal"
import CurrencyInput from "../../../../components/organisms/currency-input"
import Input from "../../../../components/molecules/input"
import Button from "../../../../components/fundamentals/button"
import Select from "../../../../components/molecules/select"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"
import { getErrorMessage } from "../../../../utils/error-messages"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import clsx from "clsx"

const ReturnMenu = ({ order, onReturn, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})

  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [shippingPrice, setShippingPrice] = useState()
  const [shippingMethod, setShippingMethod] = useState()

  const { register, setValue, handleSubmit } = useForm()

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

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(total)
    }
  }, [toReturn, quantities, shippingPrice])

  // onChange={(e) => handleQuantity(e, item)}
  //                           value={}
  //                           min={1}
  //                           max={item.quantity - item.returned_quantity}
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
        option_id: shippingMethod,
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

  const handleRefundUpdated = (e) => {
    setRefundEdited(true)
    const element = e.target
    const value = element.value

    if (value < order.refundable_amount && value >= 0) {
      setRefundAmount(parseFloat(element.value) * 100)
    }
  }

  const handleReturnAll = () => {
    if (returnAll) {
      setToReturn([])
      setReturnAll(false)
    } else {
      const newReturns = []
      const newQuantities = {}
      for (const item of order.items) {
        if (!item.returned) {
          newReturns.push(item.id)
          newQuantities[item.id] = item.quantity - item.returned_quantity
        }
      }
      setQuantities(newQuantities)
      setToReturn(newReturns)
      setReturnAll(true)
    }
  }

  const handleShippingSelected = (selectedItem) => {
    console.log(selectedItem)
    if (selectedItem.value !== "Add a shipping method") {
      setShippingMethod(selectedItem.value)
      const method = shippingOptions.find((o) => selectedItem.value === o.id)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  const handleUpdateShippingPrice = (e) => {
    const element = e.target
    const value = element.value
    if (value >= 0) {
      setShippingPrice(parseFloat(value) * 100)
    }
  }

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
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
              {allItems.map((item) => {
                // Only show items that have not been returned,
                // and aren't canceled
                if (
                  item.returned_quantity === item.quantity ||
                  isLineItemCanceled(item)
                ) {
                  return
                }

                return (
                  <Table.Row className="last:border-b-0">
                    <Table.Cell>
                      <div className="ml-1 h-full flex items-center">
                        <input
                          checked={toReturn.includes(item.id)}
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
                            <span className="text-grey-90">{item.title}</span>{" "}
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
                )
              })}
            </Table>
          </div>

          <div>
            <h3 className="inter-base-semibold">Shipping</h3>
            <Select
              label="Shipping Method"
              placeholder={"Add a shipping method"}
              value={shippingMethod}
              onChange={handleShippingSelected}
              options={shippingOptions.map((o) => ({
                label: o.name,
                value: o.id,
              }))}
            />
            {shippingMethod && (
              <Flex>
                <Box px={2} fontSize={1}>
                  Shipping price (incl. taxes)
                </Box>
                <Box px={2} width={"170px"}>
                  <CurrencyInput
                    currency={order.currency_code}
                    value={shippingPrice / 100}
                    onChange={handleUpdateShippingPrice}
                  />
                </Box>
              </Flex>
            )}
          </div>

          {refundable >= 0 && (
            <div className="flex justify-between mt-10">
              <span className="inter-base-semibold">Total Refund</span>
              <CurrencyInput
                currency={order.currency_code}
                value={refundAmount / 100}
                onChange={handleRefundUpdated}
              />
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-between">
            <Flex>
              <Box px={0} py={1}>
                <input
                  id="noNotification"
                  name="noNotification"
                  checked={!noNotification}
                  onChange={() => setNoNotification(!noNotification)}
                  type="checkbox"
                />
              </Box>
              <Box px={2} py={1}>
                <Text fontSize={1}>Send notifications</Text>
              </Box>
            </Flex>
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
