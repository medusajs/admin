import { ComponentMeta } from "@storybook/react"
import React from "react"
import ChevronRightIcon from "."

export default {
  title: "Fundamentals/Icons/ChevronRightIcon",
  component: ChevronRightIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof ChevronRightIcon>

const Template = args => <ChevronRightIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
