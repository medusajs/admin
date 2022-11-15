import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import TypeModal from "."

export default {
  title: "Template/AddTypeModal",
  component: TypeModal,
} as ComponentMeta<typeof TypeModal>

const Template: ComponentStory<typeof TypeModal> = (args) => (
  <TypeModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClose: () => {},
  onSubmit: (values) => console.log(JSON.stringify(values, null, 2)),
}
