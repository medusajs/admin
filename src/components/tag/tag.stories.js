import React from "react"
import { storiesOf } from "@storybook/react"

import Tag, { Cross } from "./index"

export default {
  title: `Tag`,
}

export const Primary = () => (
  <Tag m={0}>
    Test
    <Cross />
  </Tag>
)
