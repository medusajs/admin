import React from "react"
import { storiesOf } from "@storybook/react"

import Collapse from "./index"

export default {
  title: `Collapse`,
}

export const Primary = () => (
  <Collapse width="300px" triggerTitle="See advanced settings">
    Hello
  </Collapse>
)
