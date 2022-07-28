import { SalesChannel } from "@medusajs/medusa"
import React from "react"
import Button from "../../../../../../components/fundamentals/button"
import Modal from "../../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../../components/molecules/modal/layered-modal"
import AvailableChannelsModalScreen from "./available-channels-modal-screen"

type ProductAvailabilityModalProps = {
  salesChannels: SalesChannel[]
  storeSelectedSalesChannels: (salesChannels: SalesChannel[]) => void
  onClose: () => void
}

const ProductAvailabilityModal: React.FC<ProductAvailabilityModalProps> = ({
  salesChannels,
  onClose,
  storeSelectedSalesChannels,
}) => {
  const context = React.useContext(LayeredModalContext)

  const [availableChannels, setAvailableChannels] = React.useState<
    SalesChannel[]
  >(salesChannels)

  const onSave = () => {
    storeSelectedSalesChannels(availableChannels)
    onClose()
  }

  return (
    <LayeredModal context={context} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h2 className="inter-xlarge-semibold">Change Availability</h2>
        </Modal.Header>
        <Modal.Content>
          <AvailableChannelsModalScreen
            availableChannels={availableChannels}
            setAvailableChannels={setAvailableChannels}
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <div className="flex gap-x-xsmall">
              <Button
                onClick={onClose}
                className="w-[112px]"
                size="small"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                className="w-[112px]"
                size="small"
                variant="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default ProductAvailabilityModal
