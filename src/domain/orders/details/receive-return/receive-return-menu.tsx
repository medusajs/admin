import { Order, Return } from "@medusajs/medusa"
import { useAdminOrder, useAdminReceiveReturn } from "medusa-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"
import { ItemsToReceiveForm } from "../../components/items-to-receive-form/items-to-receive-form"
import { RefundAmountFormType } from "../../components/refund-amount-form"
import { ReceiveReturnSummary } from "../../components/rma-summaries/receive-return-summary"
import { getDefaultReceiveReturnValues } from "../utils/get-default-values"

type Props = {
  order: Order
  returnRequest: Return
  onClose: () => void
}

export type ReceiveReturnFormType = {
  receive_items: ItemsToReceiveFormType
  refund_amount: RefundAmountFormType
}

export const ReceiveReturnMenu = ({ order, returnRequest, onClose }: Props) => {
  const { mutate, isLoading } = useAdminReceiveReturn(returnRequest.id)
  const { refetch } = useAdminOrder(order.id)

  /**
   * If the return was refunded as part of a refund claim, or was created as a
   * result of a swap, we don't need to show the summary. This is because the
   * refund was either already handled as part of the claim process, or because
   * it will be handled as part of the swap process. Due to this the receive will
   * not issue a refund on completion.
   */
  const isSwapOrRefunded = useMemo(() => {
    if (returnRequest.claim_order_id) {
      const claim = order.claims.find(
        (c) => c.id === returnRequest.claim_order_id
      )
      if (!claim) {
        return false
      }

      return claim.payment_status === "refunded"
    }

    if (returnRequest.swap_id) {
      return true
    }

    return false
  }, [order.claims, returnRequest.claim_order_id, returnRequest.swap_id])

  const form = useForm<ReceiveReturnFormType>({
    defaultValues: getDefaultReceiveReturnValues(order, returnRequest),
  })
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultReceiveReturnValues(order, returnRequest))
  }, [order, returnRequest, reset])

  const onSubmit = handleSubmit((data) => {
    const refundAmount =
      data.refund_amount?.amount && !isSwapOrRefunded
        ? data.refund_amount.amount
        : undefined

    mutate(
      {
        items: data.receive_items.items.map((i) => ({
          item_id: i.item_id,
          quantity: i.quantity,
        })),
        refund: refundAmount,
      },
      {
        onSuccess: () => {
          notification(
            "Successfully received return",
            `Received return for order #${order.display_id}`,
            "success"
          )

          // We need to refetch the order to get the updated state
          refetch()

          onClose()
        },
        onError: (error) => {
          notification(
            "Failed to receive return",
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  })

  return (
    <Modal handleClose={onClose} open={true}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Receive Return</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="flex flex-col gap-y-large">
              <ItemsToReceiveForm
                order={order}
                form={nestedForm(form, "receive_items")}
              />
              {!isSwapOrRefunded && (
                <ReceiveReturnSummary
                  form={form}
                  order={order}
                  returnRequest={returnRequest}
                />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button size="small" variant="secondary">
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                disabled={!isDirty || isLoading}
                loading={isLoading}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
