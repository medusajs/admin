import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Button from "../../../../components/button"
import TextArea from "../../../../components/textarea"
import Select from "../../../../components/select"

import useMedusa from "../../../../hooks/use-medusa"

const RefundMenu = ({ order, onRefund, onDismiss }) => {
  const [note, setNote] = useState("")
  const [reason, setReason] = useState("discount")
  const [refundAmount, setRefundAmount] = useState(0)

  const reasonOptions = [
    { label: "Discount", value: "discount" },
    { label: "Other", value: "other" },
  ]

  const onSubmit = e => {
    e.preventDefault()
    if (onRefund) {
      return onRefund({
        amount: refundAmount,
        reason,
        note,
      })
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

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={onSubmit}>
        <Modal.Header>Create a refund</Modal.Header>
        <Modal.Content flexDirection="column">
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
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default RefundMenu
