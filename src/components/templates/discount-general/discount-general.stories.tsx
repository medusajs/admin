import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import DiscountGeneral, { DiscountRuleType } from "."

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

export const Edit = Template.bind({})
Edit.args = {
  subtitle: "Create a discount code for all or some of your products",
  isEdit: true,
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
  discount: {
    is_disabled: false,
    code: "test",
    rule: {
      type: DiscountRuleType.PERCENTAGE,
      description: "10% off",
    },
    regions: [
      {
        id: "eu",
        countries: [
          {
            display_name: "Denmark",
          },
          {
            display_name: "Sweden",
          },
          {
            display_name: "Finland",
          },
        ],
        name: "EU",
      },
    ],
  },
}
