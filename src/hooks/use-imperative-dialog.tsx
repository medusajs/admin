import * as React from "react"
import ReactDOM from "react-dom"
import Button from "../components/fundamentals/button"
import Modal from "../components/molecules/modal"

const DeleteDialog = ({
  open,
  heading,
  text,
  onConfirm,
  onCancel,
  confirmText = "Yes, confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Modal open={open} handleClose={onCancel}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular mt-1 text-grey-50">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-24 text-small justify-center"
              size="small"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              size="small"
              className="w-24 text-small justify-center"
              variant="danger"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const useImperativeDialog = () => {
  return ({ heading, text }) => {
    // We want a promise here so we can "await" the user's action (either confirm or cancel)
    return new Promise((resolve) => {
      const mountNode = document.createElement("div")
      let open = true

      const onConfirm = () => {
        open = false
        resolve(true)
        // trigger a rerender to close the dialog
        render()
      }

      const onCancel = () => {
        open = false
        resolve(false)
        // trigger a rerender to close the dialog
        render()
      }

      // attach the dialog in the mount node
      const render = () => {
        ReactDOM.render(
          <DeleteDialog
            heading={heading}
            text={text}
            open={open}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />,
          mountNode
        )
      }

      render()
    })
  }
}

export default useImperativeDialog
