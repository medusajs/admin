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
      render={({ message, messages }) => {
        console.log(message, messages, errors)
        return (
          <div className="text-rose-50 inter-small-regular mt-2">
            {messages ? (
              <ul className={clsx(className)}>
                {Object.entries(messages).map(([type, message]) => (
                  <li key={type}>
                    <p>– {message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{message}</p>
            )}
          </div>
        )
      }}
    />
  )
}

export default InputError
