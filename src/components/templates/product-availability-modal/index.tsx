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
  saveSelectedSalesChannels: (salesChannels: SalesChannel[]) => void
  handleClose: () => void
}

const ProductAvailabilityModal: React.FC<ProductAvailabilityModalProps> = ({
  salesChannels,
  handleClose,
  saveSelectedSalesChannels,
}) => {
  const context = React.useContext(LayeredModalContext)

  const [selectedSalesChannels, setSelectedSalesChannels] = React.useState<
    SalesChannel[]
  >(salesChannels)

  const onSave = () => {
    saveSelectedSalesChannels(selectedSalesChannels)
    handleClose()
  }

  return (
    <LayeredModal context={context} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
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
                onClick={handleClose}
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
