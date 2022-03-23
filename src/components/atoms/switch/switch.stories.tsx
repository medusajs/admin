import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import Switch from "."

export default {
  title: "Atoms/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />

export const Default = Template.bind({})
Default.args = {}
