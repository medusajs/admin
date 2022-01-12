import { ComponentMeta } from "@storybook/react"
import React from "react"
import Input from "."

export default {
  title: "Molecules/Input",
  component: Input,
} as ComponentMeta<typeof Input>

const Template = args => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
  label: "First name",
  placeholder: "LeBron James",
}

export const Required = Template.bind({})
Required.args = {
  label: "Email",
  required: true,
  placeholder: "lebron@james.com",
}

// Not currently part of the new design

// export const WithToolTip = Template.bind({})
// WithToolTip.args = {
//   label: "Default",
//   withTooltip: true,
//   tooltipText: "This is a tooltip",
// }
