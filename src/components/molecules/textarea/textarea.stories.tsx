import { ComponentMeta } from "@storybook/react"
import React from "react"
import Textarea from "."

export default {
  title: "Molecules/Textarea",
  component: Textarea,
} as ComponentMeta<typeof Textarea>

const Template = (args) => <Textarea {...args} />

export const Default = Template.bind({})
Default.args = {
  label: "Description",
  placeholder: "LeBron James",
}

export const Required = Template.bind({})
Required.args = {
  label: "Description",
  required: true,
  placeholder: "lebron@james.com",
}
