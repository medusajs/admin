import { ComponentMeta } from "@storybook/react"
import React from "react"
import TruckIcon from "."

export default {
  title: "Fundamentals/Icons/TruckIcon",
  component: TruckIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24px", "20px", "16px"],
      },
    },
  },
} as ComponentMeta<typeof TruckIcon>

const Template = args => <TruckIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24px",
  color: "currentColor",
}
