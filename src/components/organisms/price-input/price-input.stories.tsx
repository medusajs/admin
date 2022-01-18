import { ComponentMeta } from "@storybook/react"
import React from "react"
import PriceInput from "."

export default {
  title: "Organisms/PriceInput",
  component: PriceInput,
} as ComponentMeta<typeof PriceInput>

const Template = (args) => <PriceInput {...args} />

export const CurrencyEditable = Template.bind({})
CurrencyEditable.args = {
  currencyCodes: ["USD", "EUR", "GBP", "DKK", "NOK", "SEK"],
  currentCurrency: "USD",
  currentAmount: 25.95,
  onAmountChange: (amount) => {
    console.log(amount)
  },
  onCurrencyChange: (currency) => {
    console.log(currency)
  },
}

export const CurrencyNotEditable = Template.bind({})
CurrencyNotEditable.args = {
  currencyCodes: ["USD", "EUR", "GBP", "DKK", "NOK", "SEK"],
  onAmountChange: (amount) => {
    console.log(amount)
  },
}
