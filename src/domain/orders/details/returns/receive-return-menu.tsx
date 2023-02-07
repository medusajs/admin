import { useAdminReturns } from "medusa-react"
import Modal from "../../../../components/molecules/modal"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"

type Props = {
  onClose: () => void
}

type ReceiveReturnMenuFormData = {
  receive_items: ItemsToReceiveFormType
}

const ReceiveReturnMenu = ({ onClose }: Props) => {
  const {} = useAdminReturns()

  return (
    <Modal open={true} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h3 className="inter-base-semibold">Items to receive</h3>
        </Modal.Header>
        <Modal.Content></Modal.Content>
        <Modal.Footer></Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReceiveReturnMenu
