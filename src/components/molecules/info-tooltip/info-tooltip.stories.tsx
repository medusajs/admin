import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Input from "."
import InfoTooltip from "."

export default {
  title: "Molecules/InfoTooltip",
  component: InfoTooltip,
} as ComponentMeta<typeof InfoTooltip>

const Template: ComponentStory<typeof InfoTooltip> = (args) => (
  <Input {...args} />
)

export const Default = Template.bind({})
Default.args = {
  content: "Tags are one word descriptors for the product used for searches",
}
