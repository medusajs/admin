import React, { useState } from "react"
import { storiesOf } from "@storybook/react"

import Pill from "./index"

export default {
  title: `Pill`,
}

export const default_ = () => {
  const [active, setActive] = useState(false)
  return (
    <Pill onClick={() => setActive(!active)} active={active}>
      Click Me
    </Pill>
  )
}
