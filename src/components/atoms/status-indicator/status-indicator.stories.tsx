import { ComponentMeta } from "@storybook/react"
import React from "react"
import StatusIndicator from "."

export default {
  title: "Atoms/StatusIndicator",
  component: StatusIndicator,
} as ComponentMeta<typeof StatusIndicator>

const Template = args => <StatusIndicator {...args} />

export const Ok = Template.bind({})
Ok.args = {
  ok: true,
  okText: "Published",
  notOkText: "Not published",
}

export const NotOk = Template.bind({})
NotOk.args = {
  ok: false,
  okText: "Published",
  notOkText: "Not published",
}
