import { ComponentMeta } from "@storybook/react"
import React from "react"
import CoinsIcon from "."

export default {
  title: "Fundamentals/Icons/CoinsIcon",
  component: CoinsIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof CoinsIcon>

const Template = args => <CoinsIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
