import React, { useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import Modal from "../../../../components/molecules/modal"
import CurrencyInput from "../../../../components/organisms/currency-input"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import { getErrorMessage } from "../../../../utils/error-messages"
import { displayAmount } from "../../../../utils/prices"

const ReceiveMenu = ({
  order,
  returnRequest,
  onReceiveReturn,
  onReceiveSwap,
  onDismiss,
  notification,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})

  const [allItems, setAllItems] = useState([])

  useEffect(() => {
    if (order) {
      let temp = [...order.items]

      if (order.swaps && order.swaps.length) {
        for (const s of order.swaps) {
          temp = [...temp, ...s.additional_items]
        }
      }

      setAllItems(temp)
    }
  }, [order])

  useEffect(() => {
    const returns = []
    let qty = {}
    returnRequest.items.forEach((i) => {
      const item = allItems.find((l) => l.id === i.item_id)
      if (
        item &&
        !item.returned &&
        item.quantity - item.returned_quantity > 0
      ) {
        returns.push(i.item_id)
        qty = {
          ...qty,
          [i.item_id]: i.quantity,
        }
      }
    })

    setToReturn(returns)
    setQuantities(qty)
  }, [allItems])

  useEffect(() => {
    if (!toReturn.length) {
      return
    }

    const items = toReturn.map((t) => allItems.find((i) => i.id === t))
    const total =
      items.reduce((acc, next) => {
        return acc + (next.refundable / next.quantity) * quantities[next.id]
      }, 0) -
      ((returnRequest.shipping_method &&
        returnRequest.shipping_method.price * (1 + order.tax_rate / 100)) ||
        0)

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(refundAmount < 0 ? 0 : total)
    }
  }, [toReturn, quantities])

  const onSubmit = () => {
    const items = toReturn.map((t) => ({
      item_id: t,
      quantity: quantities[t],
    }))

    if (returnRequest.is_swap && onReceiveSwap) {
      setSubmitting(true)
      return onReceiveReturn(returnRequest.id, {
        items,
      })
        .then(() => onDismiss())
        .then(() =>
          notification("Success", "Successfully returned order", "success")
        )
        .catch((error) =>
          notification("Error", getErrorMessage(error), "error")
        )
        .finally(() => setSubmitting(false))
    }

    if (!returnRequest.is_swap && onReceiveReturn) {
      setSubmitting(true)
      return onReceiveReturn(returnRequest.id, {
        items,
        refund: Math.round(refundAmount),
      })
        .then(() => onDismiss())
        .then(() =>
          notification("Success", "Successfully returned order", "success")
        )
        .catch((error) =>
          notification("Error", getErrorMessage(error), "error")
        )
        .finally(() => setSubmitting(false))
    }
  }

  const handleRefundUpdated = (value) => {
    setRefundEdited(true)

    if (value < order.refundable_amount && value >= 0) {
      setRefundAmount(value)
    }
  }

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 class="inter-xlarge-semibold">Receive Return</h2>
        </Modal.Header>
        <Modal.Content>
          <h3 className="inter-base-semibold">Items to receive</h3>
          <RMASelectProductTable
            order={order}
            allItems={allItems}
            toReturn={toReturn}
            setToReturn={(items) => setToReturn(items)}
            quantities={quantities}
            setQuantities={setQuantities}
          />

          {!returnRequest.is_swap && (
            <>
              {returnRequest.shipping_method &&
                returnRequest.shipping_method.price !== undefined && (
                  <div className="my-4 flex justify-between">
                    <span className="inter-base-semibold">Shipping cost</span>
                    <span>
                      {(
                        (returnRequest.shipping_method.price / 100) *
                        (1 + order.tax_rate / 100)
                      ).toFixed(2)}{" "}
                      <span className="text-grey-50">
                        {order.currency_code.toUpperCase()}
                      </span>
                    </span>
                  </div>
                )}

              <div>
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
            </>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-xsmall">
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
              variant="primary"
              size="small"
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReceiveMenu
