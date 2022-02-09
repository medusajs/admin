import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Toaster from "."

export default {
  title: "Atoms/Toaster",
  component: Toaster.Content,
} as ComponentMeta<typeof Toaster.Content>

const Template: ComponentStory<typeof Toaster.Content> = (args) => (
  <div className="flex items-start bg-grey-0 p-base border border-grey-20 rounded-rounded shadow-toaster w-[380px]">
    <Toaster.Content {...args} />
  </div>
)

export const Success = Template.bind({})
Success.args = {
  title: "Successfully saved!",
  message: "Anyone with a link can now view this file",
}

export const Error = Template.bind({})
Error.args = {
  title: "There was an error with your submission",
  message: "Your password must be at least 8 characters",
}

export const Warning = Template.bind({})
Warning.args = {
  title: "Payment link has unregonized format",
  message:
    "Your store's payment link is not valid. Please update your store settings.",
}

export const Info = Template.bind({})
Info.args = {
  title: "Mike D. has requested a refund",
  message:
    "Mike has requested a refund for a Yamaha CS-80 Synth on order #22222",
}
