import { ComponentMeta } from "@storybook/react"
import React from "react"
import SearchIcon from "."

export default {
  title: "Fundamentals/Icons/SearchIcon",
  component: SearchIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof SearchIcon>

const Template = args => <SearchIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
