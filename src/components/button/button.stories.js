import React from "react"
import { storiesOf } from "@storybook/react"

import Button from "./index"

export default {
  title: `Button`,
}

export const Primary = () => <Button variant="primary">Click Me</Button>
export const Secondary = () => <Button variant="secondary">Click Me</Button>
