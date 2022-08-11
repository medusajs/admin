import { ErrorMessage } from "@hookform/error-message"
import clsx from "clsx"
import React from "react"

type InputErrorProps = {
  errors?: { [x: string]: unknown }
  name?: string
  className?: string
}

const InputError = ({ errors, name, className }: InputErrorProps) => {
  if (!errors || !name) {
    return null
  }

  return (
    <ErrorMessage
      name={name}
      errors={errors}
      render={({ messages }) =>
        messages && (
          <div className={clsx(className)}>
            {Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            ))}
          </div>
        )
      }
    />
  )
}

export default InputError
