import React from "react"
import Button from "../../fundamentals/button"

type Props = {
  code?: number
  message?: string
  title?: string
}

const ErrorComponent = ({ code, message, title }: Props) => {
  return (
    <div>
      {code && <h2>{code}</h2>}
      <h1>{title ? title : "Oops, something went wrong"}</h1>

      <div>
        <Button variant="primary" size="small">
          Go home
        </Button>
      </div>
    </div>
  )
}

export default ErrorComponent
