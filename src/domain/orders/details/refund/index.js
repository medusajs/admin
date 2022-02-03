import React, { useState } from "react"

import Modal from "../../../../components/molecules/modal"
import CurrencyInput from "../../../../components/organisms/currency-input"
import Button from "../../../../components/fundamentals/button"
import TextArea from "../../../../components/molecules/textarea"
import Select from "../../../../components/molecules/select"

import useToaster from "../../../../hooks/use-toaster"
import { useAdminRefundPayment } from "medusa-react"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import { getErrorMessage } from "../../../../utils/error-messages"
import AlertIcon from "../../../../components/fundamentals/icons/alert-icon"

const RefundMenu = ({ order, onDismiss }) => {
  const [note, setNote] = useState("")
  const [reason, setReason] = useState({ label: "Discount", value: "discount" })
  const [refundAmount, setRefundAmount] = useState(0)
  const [noNotification, setNoNotification] = useState(order.no_notification)

  const toaster = useToaster()
  const createRefund = useAdminRefundPayment(order.id)

  const reasonOptions = [
    { label: "Discount", value: "discount" },
    { label: "Other", value: "other" },
  ]

  const onSubmit = (e) => {
    createRefund.mutate(
      {
        amount: refundAmount,
        reason: reason.value,
        no_notification: noNotification,
        note,
      },
      {
        onSuccess: () => {
          toaster("Successfully refunded order", "success")
          onDismiss()
        },
        onError: (error) => {
          toaster(getErrorMessage(error), "error")
        },
      }
    )
  }

  const handleNoteChange = (e) => {
    setNote(e.target.value)
  }

  const handleRefundUpdated = (value) => {
    const refundable = order.total - order.refunded_total

    if (value === "" || (value <= refundable && value >= 0)) {
      setRefundAmount(value)
    }
  }

  const isSystemPayment = order.payments.some((p) => p.provider_id === "system")

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Create a refund</h2>
        </Modal.Header>
        <Modal.Content>
          {isSystemPayment && (
            <div className="inter-small-regular mb-6 p-4 text-orange-50 bg-orange-5 rounded-rounded flex text-grey-50">
              <div className="h-full mr-3">
                <AlertIcon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="inter-small-semibold">Attention!</span>
                One or more of your payments is a system payment. Be aware, that
                captures and refunds are not handled by Medusa for such
                payments.
              </div>
            </div>
          )}
          <span className="inter-base-semibold">Details</span>
          <div className="grid gap-y-base mt-4">
            <CurrencyInput
              size="small"
              currentCurrency={order.currency_code}
              readOnly
            >
              <CurrencyInput.AmountInput
                label={"Refund Amount"}
                value={refundAmount}
                onChange={handleRefundUpdated}
              />
            </CurrencyInput>
            <Select
              label="Reason"
              value={reason}
              onChange={(value) => setReason(value)}
              options={reasonOptions}
            />
            <TextArea
              inline
              label="Note"
              placeholder="Placeholder..."
              value={note}
              onChange={handleNoteChange}
            />
          </div>
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
          <div className="flex w-full  justify-between">
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
                onClick={onDismiss}
                size="small"
                className="w-[112px]"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                size="small"
                className="w-[112px]"
                variant="primary"
              >
                Complete
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default RefundMenu
