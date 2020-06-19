import React from "react"
import { storiesOf } from "@storybook/react"

import TextArea from "./index"

export default {
  title: `TextArea`,
}

export const Primary = () => <TextArea width={350} height={30} />
