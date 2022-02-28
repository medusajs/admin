import React, { ReactNode, useEffect, useState } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  SubmitErrorHandler,
  useFormContext,
} from "react-hook-form"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../../utils/error-messages"
import ErrorState from "./error-state"
import InitialState from "./initial-state"
import SavingState from "./saving-state"
import SuccessState from "./success-state"

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
  options: {
    onReset: () => void
    onSubmit: SubmitFunction | MultiSubmitFunction
    additionalDirtyStates?: { [k: string]: boolean }
  }
  children?: ReactNode
}

const TOASTER_ID = "DIRTY_STATE_TOASTER"

export const SaveNotificationProvider = ({
  options,
  children,
}: ProviderProps) => {
  const [block, setBlock] = useState(true)
  const { formState, handleSubmit } = useFormContext()
  const { onReset, onSubmit, additionalDirtyStates } = options

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlock(false)
    }, 1000) // prevent flicker on initial render

    return () => clearTimeout(timeout)
  }, [])

  const otherDirtyState = additionalDirtyStates
    ? Object.values(additionalDirtyStates).some((v) => v)
    : false

  const isDirty = !!Object.keys(formState.dirtyFields).length || otherDirtyState

  const handleError: SubmitErrorHandler<FieldValues> = (errors) => {
    const { title, list } = getFormErrors(errors)
    toast.custom((t) => <ErrorState toast={t} message={list} title={title} />, {
      position: "top-right",
      duration: 3000,
      ariaProps: {
        role: "alert",
        "aria-live": "polite",
      },
    })
  }

  const handleValid = (fn: SubmitFunction) => {
    console.log("handleValid")
    return (values: FieldValues) => {
      toast.custom((t) => <SavingState toast={t} />, {
        id: TOASTER_ID,
        position: "bottom-right",
      })

      fn(values)
        .then(() => {
          toast.dismiss(TOASTER_ID)
          toast.custom((t) => <SuccessState toast={t} />, {
            duration: 3000,
            position: "top-right",
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
          })
        })
        .catch((err) => {
          console.log(err)
          toast.dismiss(TOASTER_ID)
          toast.custom(
            (t) => (
              <ErrorState
                toast={t}
                title="There was an error with your submission"
                message={getErrorMessage(err)}
              />
            ),
            {
              duration: 3000,
              position: "top-right",
              ariaProps: {
                role: "status",
                "aria-live": "polite",
              },
            }
          )
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
          <InitialState toast={t} reset={onReset} onSave={wrapOnSubmit()} />
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
  const messages: string[] = Object.values(errors).reduce(
    (acc, { message }) => {
      if (message) {
        acc.push(message)
      }

      return acc
    },
    []
  )

  const list = (
    <ul className="list-disc list-inside">
      {messages.map((m) => (
        <li>{m}</li>
      ))}
    </ul>
  )

  const title =
    messages.length > 1
      ? `There were ${messages.length} errors with your submission`
      : "There was an error with your submission"

  return { title, list }
}
