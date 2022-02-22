import React from "react"
import type { Toast } from "react-hot-toast"
import { toast as global } from "react-hot-toast"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import ToasterContainer from "../toaster-container"

type SavingStateProps = {
  toast: Toast
  title?: string
  message?: string
}

const SuccessState: React.FC<SavingStateProps> = ({
  toast,
  title = "Success",
  message = "Your changes have been saved.",
}) => {
  const onDismiss = () => {
    global.dismiss(toast.id)
  }

  return (
    <ToasterContainer visible={toast.visible} className="w-[448px]">
      <div>
        <CheckCircleIcon size={20} className="text-emerald-40" />
      </div>
      <div className="flex flex-col ml-small mr-base gap-y-2xsmall flex-grow">
        <span className="inter-small-semibold">{title}</span>
        <span className="inter-small-regular text-grey-50">{message}</span>
      </div>
      <div>
        <button onClick={onDismiss}>
          <CrossIcon size={20} className="text-grey-40" />
        </button>
        <span className="sr-only">Close</span>
      </div>
    </ToasterContainer>
  )
}

export default SuccessState
