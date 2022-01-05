import { ComponentMeta } from "@storybook/react"
import React from "react"
import BellIcon from "."

export default {
  title: "Fundamentals/Icons/BellIcon",
  component: BellIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof BellIcon>

const Template = args => <BellIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
