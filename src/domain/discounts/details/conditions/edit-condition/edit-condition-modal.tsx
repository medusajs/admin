import React from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import { EditConditionProvider } from "./edit-condition-provider"
import ExistingConditions from "./existing-condition-resources"
// import AvailableScreen from "./available-screen"

type Props = {
  open: boolean
  condition?: any
  discount?: any
  onClose: () => void
  onSave: (conditions: any[]) => void
}

/**
 * Re-usable Sales Channels Modal, used for adding and editing sales channels both when creating a new product and editing an existing product.
 */
const EditConditionsModal = ({ open, condition, discount, onClose }: Props) => {
  const context = React.useContext(LayeredModalContext)

  return (
    <EditConditionProvider condition={condition} discount={discount}>
      <LayeredModal open={open} handleClose={onClose} context={context}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold">
              Existing {condition?.type} in Condition
            </h1>
          </Modal.Header>
          <ExistingConditions />
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
    </EditConditionProvider>
  )
}

export default EditConditionsModal
