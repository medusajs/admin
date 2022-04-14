import React, { useState } from "react"
import { ComponentMeta } from "@storybook/react"

import PriceInput from "./index"
import { currencies } from "../../../utils/currencies"

export default {
  title: "Organisms/PriceInput",
  component: PriceInput,
} as ComponentMeta<typeof PriceInput>

const Renderer = (args) => {
  const [amount, setAmount] = useState()
  console.log(amount)

  return <PriceInput amount={amount} onChange={setAmount} {...args} />
}

const Template = (args) => <Renderer {...args} />

export const Default = Template.bind({})
Default.args = {
  currency: currencies.DKK,
}
