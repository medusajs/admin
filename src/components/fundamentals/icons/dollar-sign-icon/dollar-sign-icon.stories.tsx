import { ComponentMeta } from "@storybook/react"
import React from "react"
import DollarSignIcon from "."

export default {
  title: "Fundamentals/Icons/DollarSignIcon",
  component: DollarSignIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof DollarSignIcon>

const Template = args => <DollarSignIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
