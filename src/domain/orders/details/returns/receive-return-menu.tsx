import { Order, Return } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { nestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import ItemsToReceiveForm, {
  ItemsToReceiveFormType,
} from "../../components/items-to-receive-form"
import { getDefaultReceiveReturnValues } from "../utils/get-default-values"

export type ReceiveReturnFormType = {
  receive_items: ItemsToReceiveFormType
  custom_refund_amount?: number
}

type Props = {
  open: boolean
  onClose: () => void
  order: Order
  returnRequest: Return
  refunded?: boolean
  onReceive: (
    items: { item_id: string; quantity: number }[],
    refund?: number
  ) => void
}

const ReceiveReturnMenu = ({
  open,
  onClose,
  order,
  returnRequest,
  refunded = false,
  onReceive,
}: Props) => {
  const form = useForm<ReceiveReturnFormType>({
    defaultValues: getDefaultReceiveReturnValues(order, returnRequest),
  })
  const { handleSubmit } = form

  const shippingPrice = useMemo(() => {
    let amount = 0

    if (returnRequest.shipping_method) {
      const totalTax = returnRequest.shipping_method.tax_lines?.reduce(
        (acc, line) => {
          return acc + line.rate
        },
        0
      )

      const rate = 1 + totalTax / 100

      amount = returnRequest.shipping_method.price
        ? returnRequest.shipping_method.price * rate
        : 0
    }

    return formatAmountWithSymbol({
      amount: amount,
      currency: order.currency_code,
    })
  }, [returnRequest, order])

  const onSubmit = handleSubmit((data) => {
    onReceive(
      data.receive_items.items.map((i) => ({
        item_id: i.item_id,
        quantity: i.quantity,
      })),
      data.custom_refund_amount
    )
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Receive Return</h1>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col gap-y-xlarge">
            <ItemsToReceiveForm
              order={order}
              form={nestedForm(form, "receive_items")}
            />
            <div className="flex flex-col">
              {returnRequest.shipping_method && (
                <div className="flex justify-between inter-small-regular">
                  <p>Return shipping</p>
                  <p>- {shippingPrice}</p>
                </div>
              )}
              {!refunded && (
                <div className="flex justify-between items-center inter-base-semibold mt-base">
                  <p>Total refund</p>
                  <p className="inter-large-semibold">
                    {formatAmountWithSymbol({
                      currency: order.currency_code,
                      amount: returnRequest.refund_amount,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-end gap-x-xsmall">
            <Button variant="secondary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Submit and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReceiveReturnMenu
