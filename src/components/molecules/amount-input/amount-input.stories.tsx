import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import AmountInput from "."

export default {
  title: "Molecules/AmountInput",
  component: AmountInput,
} as ComponentMeta<typeof AmountInput>

const Template: ComponentStory<typeof AmountInput> = (props) => {
  return (
    <div>
      <AmountInput {...props} />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: "Price",
}
