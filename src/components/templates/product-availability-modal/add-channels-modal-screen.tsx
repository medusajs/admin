import React from "react"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import { LayeredModalContext } from "../../molecules/modal/layered-modal"

export const useAddChannelsModalScreen = () => {
  const { pop } = React.useContext(LayeredModalContext)

  return {
    title: "Add Sales Channels",
    onBack: () => pop(),
    onConfirm: () => pop(),
    view: <AddChannelsModalScreen />,
  }
}

type AddChannelsModalScreenProps = {}

const AddChannelsModalScreen: React.FC<AddChannelsModalScreenProps> = ({}) => {
  const { pop } = React.useContext(LayeredModalContext)

  return (
    <>
      <Modal.Content isLargeModal></Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            className="w-[128px]"
            onClick={() => pop()}
          >
            Add and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddChannelsModalScreen
