import React from "react"
import { storiesOf } from "@storybook/react"

import Button from "./index"

export default {
  title: `Button`,
}

export const light = () => <Button>Click Me</Button>
export const dark = () => <Button dark>Click Me</Button>
export const withEmoji = () => <Button>😃</Button>
