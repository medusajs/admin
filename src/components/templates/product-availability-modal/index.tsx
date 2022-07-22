import { SalesChannel } from "@medusajs/medusa"
import React from "react"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../molecules/modal/layered-modal"
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

  const [selectedSalesChannels, setSelectedSalesChannels] = React.useState<
    SalesChannel[]
  >(salesChannels)

  const onSave = () => {
    storeSelectedSalesChannels(selectedSalesChannels)
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
            salesChannels={selectedSalesChannels}
            setSelectedSalesChannels={setSelectedSalesChannels}
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
