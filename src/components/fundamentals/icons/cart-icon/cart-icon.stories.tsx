import { ComponentMeta } from "@storybook/react"
import CartIcon from "."

export default {
  title: "Fundamentals/Icons/CartIcon",
  component: CartIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof CartIcon>

const Template = (args) => <CartIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
