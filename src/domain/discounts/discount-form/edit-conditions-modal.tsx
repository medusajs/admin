import React from "react"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import { DiscountConditionType } from "../types"

type EditConditionsModalProps = {
  onClose: () => void
  view: DiscountConditionType
}

const EditConditionsModal: React.FC<EditConditionsModalProps> = ({
  onClose,
  view,
}) => {
  return (
    <Modal open handleClose={onClose}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Edit</h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
          {() => {
            switch (view) {
              case DiscountConditionType.PRODUCTS:
                return <span>Products</span>
              case DiscountConditionType.CUSTOMER_GROUPS:
                return "Customer Groups"
              case DiscountConditionType.PRODUCT_COLLECTIONS:
                return "Collections"
              default:
                return <div>hey</div>
            }
          }}
          <div>{view}</div>
        </Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex items-center justify-end w-full gap-x-xsmall">
          <Button variant="secondary" size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="small" onClick={onClose}>
            Delete condition
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={onClose}
            className="min-w-[128px]"
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditConditionsModal
