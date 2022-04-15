import React, { useState } from "react"
import { ComponentMeta } from "@storybook/react"

import PriceInput from "./index"
import { currencies } from "../../../utils/currencies"

export default {
  title: "Organisms/PriceInput",
  component: PriceInput,
} as ComponentMeta<typeof PriceInput>

const Template = (args) => <PriceInput {...args} />

export const Default = Template.bind({})
Default.args = {
  currency: currencies.DKK,
  // amount: 1234567,
}
