import { ComponentMeta } from "@storybook/react"
import React from "react"
import CurrencyInput from "."

export default {
  title: "Molecules/CurrencyInput",
  component: CurrencyInput,
} as ComponentMeta<typeof CurrencyInput>

const Template = (args) => <CurrencyInput {...args} />

export const Select = Template.bind({})
Select.args = {
  options: ["USD", "EUR", "GBP", "DKK", "NOK", "SEK"],
  onChange: (currency) => {
    console.log(currency)
  },
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  currentCurrency: "USD",
}
