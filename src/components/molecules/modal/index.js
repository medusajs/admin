import React from "react"
import PropTypes from "prop-types"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import * as Dialog from "@radix-ui/react-dialog"

const Overlay = ({ children }) => {
  return (
    <Dialog.Overlay className="fixed bg-grey-90/40 grid top-0 left-0 right-0 bottom-0 place-items-center overflow-y-auto">
      {children}
    </Dialog.Overlay>
  )
}

const Content = ({ children }) => {
  return (
    <Dialog.Content className="bg-grey-0 min-w-modal rounded">
      {children}
    </Dialog.Content>
  )
}

const addProp = (children, prop) => {
  return React.Children.map(children, c => React.cloneElement(c, prop))
}

const Modal = ({ children, handleClose, isLargeModal = true }) => {
  const largeModal = isLargeModal
  return (
    <Dialog.Root open={true} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Overlay>
          <Content>{addProp(children, largeModal)}</Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

Modal.Body = ({ children, largeModal = true }) => {
  return (
    <div className="inter-base-regular" onClick={e => e.stopPropagation()}>
      {addProp(children, largeModal)}
    </div>
  )
}

Modal.Content = ({ children, largeModal = true }) => {
  return (
    <div className={`px-7 pt-5 ${largeModal ? "w-[750px] pb-7" : "pb-5"}`}>
      {" "}
      {children}
    </div>
  )
}

Modal.Header = ({ children, handleClose = undefined }) => {
  return (
    <div
      className="pl-7 pt-3.5 pr-3.5 flex flex-col w-full"
      onClick={e => e.stopPropagation()}
    >
      <div className="pb-1 flex w-full justify-end">
        {handleClose && (
          <span onClick={handleClose} className="text-grey-50 cursor-pointer">
            <CrossIcon size={20} />
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

Modal.Footer = ({ children, largeModal = true }) => {
  return (
    <div
      onClick={e => e.stopPropagation()}
      className={`px-7  pb-5 flex w-full ${
        largeModal ? "border-t border-grey-20 pt-3.5" : ""
      }`}
    >
      {children}
    </div>
  )
}

Modal.Header.propTypes = {
  handleClose: PropTypes.func,
}

Modal.propTypes = {
  isLargeModal: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default Modal
