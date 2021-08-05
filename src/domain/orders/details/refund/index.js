import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Button from "../../../../components/button"
import TextArea from "../../../../components/textarea"
import Select from "../../../../components/select"

import useMedusa from "../../../../hooks/use-medusa"

const RefundMenu = ({ order, onRefund, onDismiss, toaster }) => {
  const [note, setNote] = useState("")
  const [reason, setReason] = useState("discount")
  const [refundAmount, setRefundAmount] = useState(0)
  const [noNotification, setNoNotification] = useState(order.no_notification)

  const reasonOptions = [
    { label: "Discount", value: "discount" },
    { label: "Other", value: "other" },
  ]

  const onSubmit = e => {
    e.preventDefault()
    if (onRefund) {
      return onRefund({
        amount: Math.round(refundAmount * 100),
        reason,
        note,
        no_notification:
          noNotification !== order.no_notification ? noNotification : undefined,
      })
        .then(() => onDismiss())
        .then(() => toaster("Successfully refunded order", "success"))
        .catch(() => toaster("Failed to refund order", "error"))
    }
  }

  const handleNoteChange = e => {
    const element = e.target
    setNote(element.value)
  }

  const handleRefundUpdated = e => {
    const refundable = order.total - order.refunded_total
    const element = e.target
    const value = parseFloat(element.value) || ""

    if (value === "" || (value <= refundable && value >= 0)) {
      setRefundAmount(value)
    }
  }

  const isSystemPayment = order.payments.some(p => p.provider_id === "system")

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={onSubmit}>
        <Modal.Header>Create a refund</Modal.Header>
        <Modal.Content flexDirection="column" maxWidth="500px">
          {isSystemPayment && (
            <Text
              fontSize={1}
              fontStyle="italic"
              mb={4}
              width="100%"
              textAlign="center"
            >
              One or more of your payments is a system payment. Be aware, that
              captures and refunds are not handled by Medusa for such payments.
            </Text>
          )}
          <Box px={2}>
            <CurrencyInput
              inline
              label="Refund Amount"
              currency={order.currency_code}
              value={refundAmount}
              onChange={handleRefundUpdated}
            />
          </Box>
          <Box mt={4} px={2}>
            <Select
              inline
              label="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              options={reasonOptions}
            />
          </Box>
          <Box mt={3} px={2}>
            <TextArea
              inline
              label="Note"
              value={note}
              onChange={handleNoteChange}
            />
          </Box>
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
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
          <Button type="submit" variant="primary">
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default RefundMenu
