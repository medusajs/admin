import React from "react"
import { storiesOf } from "@storybook/react"

import Dropdown from "./index"

export default {
  title: `Dropdown`,
}

export const Primary = () => (
  <Dropdown
    defaultValue="Choose ..."
    options={[
      { key: "1", value: "Michael Jordan" },
      { key: "2", value: "Steve Kerr" },
      { key: "3", value: "Scottie Pippen" },
    ]}
    width="300px"
  />
)
