import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import CurrencyInput from "."

export default {
  title: "Organisms/CurrencyInput",
  component: CurrencyInput,
} as ComponentMeta<typeof CurrencyInput>

const Template: ComponentStory<typeof CurrencyInput> = (args) => (
  <CurrencyInput {...args} />
)

export const Default = Template.bind({})
Default.args = {
  currentCurrency: "usd",
  currencyCodes: ["usd", "eur", "gbp"],
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  currentCurrency: "usd",
  readOnly: true,
}

const TemplateWithAmount = (args) => (
  <CurrencyInput {...args.currencyArgs}>
    <CurrencyInput.AmountInput {...args.amountArgs}></CurrencyInput.AmountInput>
  </CurrencyInput>
)

export const WithAmount = TemplateWithAmount.bind({})
WithAmount.args = {
  currencyArgs: {
    currentCurrency: "usd",
    currencyCodes: ["usd", "eur", "krw"],
    size: "small",
  },
  amountArgs: {
    label: "Price",
    amount: 10000,
  },
}
