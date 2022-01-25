import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import DiscountGeneral from "."

export default {
  title: "Templates/DiscountGeneral",
  component: DiscountGeneral,
} as ComponentMeta<typeof DiscountGeneral>

const Template: ComponentStory<typeof DiscountGeneral> = (args) => (
  <DiscountGeneral {...args} />
)

export const Default = Template.bind({})
Default.args = {
  subtitle: "Create a discount code for all or some of your products",
  isEdit: false,
  regionOptions: [
    {
      label: "EU (Denmark, Sweden, Finland, Norway, Germany, Austria, UK)",
      value: "eu",
    },
    {
      label: "Americas (USA, Canada)",
      value: "americas",
    },
  ],
}
