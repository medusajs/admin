import React from "react"
import Button from "../../fundamentals/button"
import CrossIcon from "../../fundamentals/icons/cross-icon"

type FocusModalProps = {
  handleClose: () => void
  onSubmit: (e: any) => void
  cancelText?: string
  submitText?: string
}

const FocusModal: React.FC<FocusModalProps> = ({
  handleClose,
  onSubmit,
  children,
  cancelText = "Cancel",
  submitText = "Save changes",
}) => {
  return (
    <div className="absolute inset-0 bg-grey-0 z-50 flex flex-col items-center">
      <FocusModalHeader
        handleClose={handleClose}
        onSubmit={onSubmit}
        cancelText={cancelText}
        submitText={submitText}
      />
      <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full px-8 overflow-y-auto h-full">
        {children}
      </div>
    </div>
  )
}

const FocusModalHeader: React.FC<FocusModalProps> = ({
  handleClose,
  onSubmit,
  cancelText,
  submitText,
}) => {
  return (
    <div className="w-full border-b py-4 border-b-grey-20 flex justify-center">
      <div className="medium:w-8/12 w-full px-8 flex justify-between">
        <Button
          size="small"
          variant="ghost"
          onClick={handleClose}
          className="border rounded-rounded w-8 h-8"
        >
          <CrossIcon size={20} />
        </Button>
        <div className="gap-x-small flex">
          <Button
            onClick={handleClose}
            size="small"
            variant="ghost"
            className="border rounded-rounded"
          >
            {cancelText || "Cancel"}
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSubmit}
            className="rounded-rounded"
          >
            {submitText || "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FocusModal
