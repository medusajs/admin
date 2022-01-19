import React from "react"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import clsx from "clsx"
import * as Dialog from "@radix-ui/react-dialog"

type ModalProps = {
  isLargeModal?: boolean
  handleClose: () => void
}

type ModalChildProps = {
  isLargeModal?: boolean
}

type ModalHeaderProps = {
  handleClose: () => void
}

type ModalType = React.FC<ModalProps> & {
  Body: React.FC<ModalChildProps>
  Header: React.FC<ModalHeaderProps>
  Footer: React.FC<ModalChildProps>
  Content: React.FC<ModalChildProps>
}

const Overlay: React.FC = ({ children }) => {
  return (
    <Dialog.Overlay className="fixed bg-grey-90/40 z-50 grid top-0 left-0 right-0 bottom-0 place-items-center overflow-y-auto">
      {children}
    </Dialog.Overlay>
  )
}

const Content: React.FC = ({ children }) => {
  return (
    <Dialog.Content className="bg-grey-0 min-w-modal rounded">
      {children}
    </Dialog.Content>
  )
}

const addProp = (children, prop) => {
  return React.Children.map(children, (child) =>
    React.cloneElement(child, prop)
  )
}

const Modal: ModalType = ({ handleClose, isLargeModal = true, children }) => {
  return (
    <Dialog.Root open={true} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Overlay>
          <Content>{addProp(children, { isLargeModal })}</Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

Modal.Body = ({ children, isLargeModal }) => {
  return (
    <div className="inter-base-regular" onClick={(e) => e.stopPropagation()}>
      {addProp(children, { isLargeModal })}
    </div>
  )
}

Modal.Content = ({ children, isLargeModal }) => {
  return (
    <div
      className={clsx("px-7 pt-5", {
        ["w-largeModal pb-7"]: isLargeModal,
        ["pb-5"]: !isLargeModal,
      })}
    >
      {children}
    </div>
  )
}

Modal.Header = ({ handleClose = undefined, children }) => {
  return (
    <div
      className="pl-7 pt-3.5 pr-3.5 flex flex-col w-full"
      onClick={(e) => e.stopPropagation()}
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

Modal.Footer = ({ children, isLargeModal }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx("px-7  pb-5 flex w-full", {
        "border-t border-grey-20 pt-4": isLargeModal,
      })}
    >
      {children}
    </div>
  )
}

export default Modal
