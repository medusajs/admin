import React from "react"

const Modal = ({onClick, children, ...rest}) => {
  return (
    <div onClick={onClick} className="fixed top-0 left-0 z-[999] flex justify-center items-center w-full h-full overflow-auto bg-grey-90/40">
      {children}
    </div>
  )
}

Modal.Body = ({ children, ...rest }) => {
  return (
    <div onClick={e => e.stopPropagation()} className="flex flex-col bg-grey-0 min-w-modal rounded">
      {children}
    </div>
  )
}

Modal.Content = ({ children, ...rest }) => {
  return (<div className="flex overflow-auto px-7 py-4">
    {children}
  </div>)
}

Modal.Header = ({ children, handleClose, ...rest }) => {
  return (<div className="px-7 pt-3">
    {children}
  </div>)
}

Modal.Footer = ({ children, ...rest }) => {
  return (<div onClick={e => e.stopPropagation()} className="items-center border-t border-grey-20 flex w-full px-7 pt-3.5 pb-5">
    {children}
  </div>)
}

export default Modal
