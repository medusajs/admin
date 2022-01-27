import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Avatar from "../../atoms/avatar"
import BackIcon from "../../fundamentals/icons/back-icon"
import MailIcon from "../../fundamentals/icons/mail-icon"
import SendIcon from "../../fundamentals/icons/send-icon"
import EventContainer from "./event-container"

export default {
  title: "Molecules/EventContainer",
  component: EventContainer,
} as ComponentMeta<typeof EventContainer>

const Template: ComponentStory<typeof EventContainer> = (args) => (
  <div className="max-w-md px-xlarge py-large">
    <EventContainer {...args} />
  </div>
)

export const Note = Template.bind({})
Note.args = {
  icon: <Avatar user={{ email: "kasper@medusajs.com" }} />,
  title: "kasper@medusajs.com",
  actions: [
    {
      label: "Request Return",
      icon: <BackIcon size={20} />,
      onClick: () => {},
    },
    {
      label: "Register Return",
      icon: <BackIcon size={20} />,
      onClick: () => {},
    },
    {
      label: "Request Return",
      icon: <BackIcon size={20} />,
      onClick: () => {},
    },
  ],
  date: new Date(),
  children: (
    <div className="bg-grey-5 rounded-2xl px-base py-base">
      Return will be shipped together with return 74421
    </div>
  ),
}

export const MailNotice = Template.bind({})
MailNotice.args = {
  icon: <MailIcon size={20} />,
  date: new Date(),
  title: "Shipment Notice Sent",
  to: "kasper@medusajs.com",
  actions: [
    {
      icon: <SendIcon size={20} />,
      label: "Re-Send Email",
      onClick: () => {},
    },
  ],
}
