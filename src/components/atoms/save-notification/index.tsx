import React, { ReactNode } from "react"
import type { Toast } from "react-hot-toast"
import { toast as global } from "react-hot-toast"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import {
  MultiHandler,
  SaveHandler,
} from "../../organisms/save-notifications/notification-provider"
import ToasterContainer from "../toaster-container"
import MultiActionButton from "./multi-action-button"

type SaveNotificationProps = {
  toast: Toast
  icon?: ReactNode
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onSave:
    | MultiHandler[]
    | {
        onSubmit: SaveHandler
      }
  reset: () => void
}

const SaveNotification: React.FC<SaveNotificationProps> = ({
  toast,
  icon,
  title = "Unsaved changes",
  message = "Do you want to save your changes?",
  confirmText = "Save",
  cancelText = "Discard",
  onSave,
  reset,
}) => {
  const onDismiss = () => {
    global.dismiss(toast.id)
  }

  const onDiscard = () => {
    reset()
    onDismiss()
  }

  return (
    <ToasterContainer visible={toast.visible} className="py-0 px-0 w-[448px]">
      <div className="py-base pl-base">{getIcon(icon)}</div>
      <div className="flex flex-col ml-small mr-base gap-y-2xsmall flex-grow py-base">
        <span className="inter-small-semibold">{title}</span>
        <span className="inter-small-regular text-grey-50">{message}</span>
      </div>
      <div className="flex flex-col inter-small-semibold border-l border-grey-20 h-full">
        <MultiActionButton
          originalId={toast.id}
          label={confirmText}
          className="inter-small-semibold flex items-center justify-center h-1/2 border-b border-grey-20 px-base text-violet-60 inter-small-semibold"
          handler={onSave}
        />
        <button
          className="inter-small-semibold flex items-center justify-center h-1/2 px-base"
          onClick={onDiscard}
        >
          {cancelText}
        </button>
      </div>
    </ToasterContainer>
  )
}

const ICON_SIZE = 20

function getIcon(icon?: any) {
  if (icon) {
    return React.cloneElement(icon, {
      size: ICON_SIZE,
      className: "text-grey-90",
    })
  } else {
    return <RefreshIcon size={20} className="text-grey-90" />
  }
}

export default SaveNotification
