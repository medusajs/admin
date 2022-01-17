import { ComponentMeta } from "@storybook/react"
import React from "react"
import DenominationBadge from "."

export default {
  title: "Atoms/DenominationBadge",
  component: DenominationBadge,
} as ComponentMeta<typeof DenominationBadge>

const Template = args => <DenominationBadge {...args} />

export const DanishKroner = Template.bind({})
DanishKroner.args = {
  amount: 1000,
  currencyCode: "DKK",
  conversion: 100,
}

export const JapaneseYen = Template.bind({})
JapaneseYen.args = {
  amount: 250000,
  currencyCode: "JPY",
  conversion: 100,
}

export const KoreanWon = Template.bind({})
KoreanWon.args = {
  amount: 10000000,
  currencyCode: "KRW",
  conversion: 100,
}
