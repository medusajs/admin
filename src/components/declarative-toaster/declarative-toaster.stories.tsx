import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { TableToasterContainer } from "../molecules/table-toaster"
import Toaster from "./"

export default {
  title: "Components/DeclarativeToaster",
  component: Toaster,
} as ComponentMeta<typeof Toaster>

const Template: ComponentStory<typeof Toaster> = (args) => <Toaster {...args} />

export const Default = Template.bind({})
Default.args = {
  visible: true,
  duration: Infinity,
  position: "bottom-center",
  children: <TableToasterContainer>hello</TableToasterContainer>,
}
