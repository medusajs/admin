import React, { useState } from "react"
import { storiesOf } from "@storybook/react"

import Button from "./index"

export default {
  title: `Button`,
}

export const Primary = () => <Button variant="primary">Click Me</Button>
export const Secondary = () => <Button variant="secondary">Click Me</Button>

export const Loading = () => {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 1000 * 2)
  }

  return (
    <Button variant="primary" loading={loading} onClick={handleClick}>
      Click and load
    </Button>
  )
}
