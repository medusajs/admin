import { ComponentMeta } from "@storybook/react"
import React from "react"
import Sidebar from "."

export default {
  title: "Organisms/Sidebar",
  component: Sidebar,
} as ComponentMeta<typeof Sidebar>

const Template = args => <Sidebar {...args} />

export const Default = Template.bind({})
Default.args = {}
