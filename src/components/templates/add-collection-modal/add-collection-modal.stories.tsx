import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import AddCollectionModal from "."

export default {
  title: "Template/AddCollectionModal",
  component: AddCollectionModal,
} as ComponentMeta<typeof AddCollectionModal>

const Template: ComponentStory<typeof AddCollectionModal> = (args) => (
  <AddCollectionModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClose: () => {},
  onSubmit: (values) => console.log(JSON.stringify(values, null, 2)),
}
