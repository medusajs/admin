import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import AddMetadata from "."

export default {
  title: "Organisms/AddMetadata",
  component: AddMetadata,
} as ComponentMeta<typeof AddMetadata>

const Template: ComponentStory<typeof AddMetadata> = (args) => (
  <div className="max-w-md">
    <AddMetadata {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  register: () => {},
  unregister: () => {},
}
