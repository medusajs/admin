import { ComponentMeta } from "@storybook/react"
import CartIcon from "."

const cartIconComponentMeta: ComponentMeta<typeof CartIcon> = {
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
}

export default cartIconComponentMeta

const Template = (args) => <CartIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
