import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import UploadModal from "./"

export default {
  title: "Organisms/UploadModal",
  component: UploadModal,
} as ComponentMeta<typeof UploadModal>

const Template: ComponentStory<typeof UploadModal> = (args) => (
  <UploadModal {...args} />
)

export const Default = Template.bind({})
Default.args = {}
