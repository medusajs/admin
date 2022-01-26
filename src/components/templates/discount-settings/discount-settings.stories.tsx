import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import DiscountSettings from "."

export default {
  title: "Templates/DiscountSettings",
  component: DiscountSettings,
} as ComponentMeta<typeof DiscountSettings>

const Template: ComponentStory<typeof DiscountSettings> = (args) => (
  <DiscountSettings {...args} />
)

export const Default = Template.bind({})
Default.args = {}
