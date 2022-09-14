import { Store } from "@medusajs/medusa"
import React from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"

type Props = {
  open: boolean
  onClose: () => void
  store: Store
}

const DefaultStoreCurrencyModal = ({ open, onClose }: Props) => {
  return (
    <Modal handleClose={onClose} open={open}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Default store currency</h1>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <div className="flex items-center gap-x-xsmall w-full justify-end">
            <Button variant="secondary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DefaultStoreCurrencyModal
