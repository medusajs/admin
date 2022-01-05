import { ComponentMeta } from "@storybook/react"
import React from "react"
import UserIcon from "."

export default {
  title: "Fundamentals/Icons/UserIcon",
  component: UserIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof UserIcon>

const Template = args => <UserIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
