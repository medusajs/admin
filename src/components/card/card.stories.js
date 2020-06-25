import React from "react"
import { storiesOf } from "@storybook/react"

import Card from "./index"

export default {
  title: `Card`,
}

export const StyledCard = () => (
  <Card width="100%" triggerTitle="See advanced settings">
    Hello
  </Card>
)
