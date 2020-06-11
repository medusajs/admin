import React from "react"
import { storiesOf } from "@storybook/react"

import InputField from "./index"

export default {
  title: `Input`,
}

export const Primary = () => <InputField width={350} height={30} />
