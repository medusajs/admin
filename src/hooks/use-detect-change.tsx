import React, { ReactNode, useEffect } from "react"
import { toast } from "react-hot-toast"
import SaveNotification from "../components/atoms/save-notification"

export type NotificationAction = {
  label: string
  icon: any
  onClick: () => Promise<void>
}

type Options = {
  fn: NotificationAction[] | (() => Promise<void>)
  title: string
  message: string
  icon?: ReactNode
}

type UseDetectChangeProps = {
  isDirty: boolean
  reset: () => void
  handleSubmit: any
  options: Options
}

const useDetectChange = ({
  isDirty,
  reset,
  handleSubmit,
  options,
}: UseDetectChangeProps) => {
  useEffect(() => {
    const { fn, title, message, icon } = options

    const showToaster = () => {
      toast.custom(
        (t) => (
          <SaveNotification
            toast={t}
            icon={icon}
            title={title}
            message={message}
            onSave={fn}
            reset={reset}
          />
        ),
        {
          position: "bottom-right",
          duration: Infinity,
          id: "form-change",
        }
      )
    }

    if (isDirty) {
      showToaster()
    } else {
      toast.dismiss("form-change")
    }
  }, [isDirty, options])
}

export default useDetectChange
