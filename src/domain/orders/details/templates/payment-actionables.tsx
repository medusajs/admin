import React from "react"

import useToaster from "../../../../hooks/use-toaster"
import { getErrorMessage } from "../../../../utils/error-messages"
import Button from "../../../../components/fundamentals/button"

export const PaymentActionables = ({ order, capturePayment }) => {
  const toaster = useToaster()
  const isSystemPayment = order?.payments?.some(
    (p) => p.provider_id === "system"
  )

  const { payment_status } = order!

  // Default label and action
  let label = "Capture payment"
  let action = () => {
    capturePayment.mutate(void {}, {
      onSuccess: () => toaster("Successfully captured payment", "success"),
      onError: (err) => toaster(getErrorMessage(err), "error"),
    })
  }
  const loading = capturePayment.isLoading

  let shouldShowNotice = false
  // If payment is a system payment, we want to show a notice
  if (payment_status === "awaiting" && isSystemPayment) {
    shouldShowNotice = true
  }

  if (payment_status === "requires_action" && isSystemPayment) {
    shouldShowNotice = true
  }

  switch (true) {
    case payment_status === "captured" ||
      payment_status === "partially_refunded": {
      label = "Refund"
      action = () => console.log("TODO: Show refund menu")
      break
    }

    case shouldShowNotice: {
      action = () =>
        console.log(
          "TODO: Show alert indicating, that you are capturing a system payment"
        )
      break
    }

    case payment_status === "requires_action": {
      return null
    }
    default:
      break
  }

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={action}
      loading={loading}
      className="min-w-[130px]"
    >
      {label}
    </Button>
  )
}
