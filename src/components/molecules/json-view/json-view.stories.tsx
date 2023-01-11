import { ComponentMeta, ComponentStory } from "@storybook/react"
import JSONView from "."

export default {
  title: "Molecules/JSONView",
  component: JSONView,
} as ComponentMeta<typeof JSONView>

const Template: ComponentStory<typeof JSONView> = (args) => (
  <JSONView {...args} />
)

export const Default = Template.bind({})
const metadata = {
  test: true,
  valid_days: ["monday", "wednesday", "friday"],
}

Default.args = {
  data: metadata,
}

export const WithName = Template.bind({})
WithName.args = {
  data: metadata,
}
