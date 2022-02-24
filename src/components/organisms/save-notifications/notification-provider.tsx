import React, { ReactNode, useEffect, useState } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  SubmitErrorHandler,
  useFormContext,
} from "react-hook-form"
import toast from "react-hot-toast"
import SaveNotification from "../../atoms/save-notification"
import ErrorState from "../../atoms/save-notification/error-state"
import SavingState from "../../atoms/save-notification/saving-state"
import SuccessState from "../../atoms/save-notification/success-state"

export type SubmitFunction = (values: FieldValues) => Promise<void>
export type MultiSubmitFunction = {
  label: string
  icon?: any
  onSubmit: SubmitFunction
}[]

export type SaveHandler = (
  e?: React.BaseSyntheticEvent<object, any, any> | undefined
) => Promise<void>

export type MultiHandler = {
  label: string
  icon?: any
  onSubmit: SaveHandler
}

type ProviderProps = {
  values: {
    onReset: () => void
    onSubmit: SubmitFunction | MultiSubmitFunction
  }
  children?: ReactNode
}

const TOASTER_ID = "DIRTY_STATE_TOASTER"

export const SaveNotificationProvider = ({
  values,
  children,
}: ProviderProps) => {
  const [block, setBlock] = useState(true)
  const { formState, handleSubmit } = useFormContext()
  const { onReset, onSubmit } = values

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlock(false)
    }, 1000) // prevent flicker on initial render

    return () => clearTimeout(timeout)
  }, [])

  const isDirty = !!Object.keys(formState.dirtyFields).length

  const handleError: SubmitErrorHandler<FieldValues> = (errors) => {
    const msgs = getFormErrors(errors)
    console.error(msgs)
    toast.error(msgs.join(", "), {
      duration: 3000,
      position: "top-right",
    })
  }

  const handleValid = (fn: SubmitFunction) => {
    return (values: FieldValues) => {
      toast.custom((t) => <SavingState toast={t} />, {
        id: TOASTER_ID,
      })

      fn(values)
        .then(() => {
          toast.dismiss(TOASTER_ID)
          toast.custom((t) => <SuccessState toast={t} />, {
            duration: 3000,
            position: "bottom-right",
          })
        })
        .catch(() => {
          toast.dismiss(TOASTER_ID)
          toast.custom((t) => <ErrorState toast={t} />, {
            duration: 3000,
            position: "bottom-right",
          })
        })
    }
  }

  const wrapOnSubmit = () => {
    if (Array.isArray(onSubmit)) {
      return onSubmit.map((fn) => {
        return {
          label: fn.label,
          icon: fn.icon,
          onSubmit: handleSubmit(handleValid(fn.onSubmit), handleError),
        }
      })
    }

    return {
      onSubmit: handleSubmit(handleValid(onSubmit), handleError),
    }
  }

  useEffect(() => {
    if (isDirty && !block) {
      toast.custom(
        (t) => (
          <SaveNotification toast={t} reset={onReset} onSave={wrapOnSubmit()} />
        ),
        {
          position: "bottom-right",
          duration: Infinity,
          id: TOASTER_ID,
        }
      )
    } else {
      toast.dismiss(TOASTER_ID)
    }

    return () => toast.dismiss(TOASTER_ID)
  }, [isDirty, block])

  return <>{children}</>
}

function getFormErrors(errors: DeepMap<FieldValues, FieldError>) {
  return Object.values(errors).reduce((acc, { message }) => {
    if (message) {
      acc.push(message)
    }

    return acc
  }, [])
}
