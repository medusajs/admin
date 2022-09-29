import React, { useContext } from "react"

import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"

type OrderEditModalProps = {
  close: () => void
}

/**
 * Displays layered modal for order editing.
 */
function OrderEditModal(props: OrderEditModalProps) {
  const { close } = props
  const layeredModalContext = useContext(LayeredModalContext)

  const onClose = () => {
    close()
  }

  return (
    <LayeredModal
      open={open}
      handleClose={onClose}
      context={layeredModalContext}
    >
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          {/*<h1 className="inter-xlarge-semibold">Current Sales Channels</h1>*/}
        </Modal.Header>
        <Modal.Footer>
          <div className="flex items-center justify-end w-full">
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default OrderEditModal
