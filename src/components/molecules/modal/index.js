import React from 'react'
import { ReactComponent as CloseIcon } from "../../../assets/svg/2.0/20px/x.svg"
import * as Dialog from '@radix-ui/react-dialog'

const Overlay = ({children, ...rest}) => {
  return (<Dialog.Overlay className='fixed bg-grey-90/40 grid top-0 left-0 right-0 bottom-0 place-items-center overflow-y-auto'>
    {children}
  </Dialog.Overlay>)
}

const Content = ({children, ...rest}) => {
  return (<Dialog.Content className='bg-grey-0 min-w-modal rounded'>
    {children}
  </Dialog.Content>)
}

const addProp = (children, prop) => {
  return !Array.isArray(children) ? React.cloneElement(children, {...prop}) : 
    children.map(child => React.cloneElement(child, {...prop}))
}

const Modal = ({children, onClick, isLargeModal, ...rest}) => {
  const largeModal = isLargeModal
  return (
    <Dialog.Root open={true} onOpenChange={onClick}>
      <Dialog.Portal>
        <Overlay>
          <Content>
            {addProp(children, {largeModal})}
          </Content> 
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>)
}

Modal.Body =  ({ children, largeModal = true, ...rest }) => {
  return (
    <div className='inter-base-regular' onClick={e => e.stopPropagation()}>
      {addProp(children, {largeModal})}
    </div>
  )
}

Modal.Content = ({ children, largeModal = true, ...rest }) => {
 return (<div className={`px-7 pt-5 ${largeModal ? "w-[750px] pb-7" : "pb-5"}`}> {addProp(children, {largeModal})}</div>)
}

Modal.Header = ({ children, largeModal = true, handleClose, showCloseIcon = true,...rest }) => {
  return (
    <div className='pl-7 pt-3.5 pr-3.5 flex flex-col w-full' onClick={e => e.stopPropagation()}>
      <div className='pb-1 flex w-full justify-end'>
        {showCloseIcon && (<span onClick={handleClose} className="stroke-grey-50 cursor-pointer">
          <CloseIcon />
        </span>)}
      </div>
      {addProp(children, {largeModal})}
    </div>
  )
}

Modal.Footer = ({ children, largeModal = true, ...rest }) => {
  return (
    <div onClick={e => e.stopPropagation()} className={`px-7  pb-5 flex w-full ${largeModal ? "border-t border-grey-20 pt-3.5": ""}`}>
      {addProp(children, {largeModal})}
    </div>
  )
}


export default Modal