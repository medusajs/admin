import { ComponentMeta } from "@storybook/react"
import React from "react"
import Button from "."

export default {
  title: "Fundamentals/Button",
  component: Button,
} as ComponentMeta<typeof Button>

const Template = args => <Button {...args}>Action</Button>

export const PrimaryLarge = Template.bind({})
PrimaryLarge.args = {
  variant: "primary",
  size: "large",
}

export const PrimaryLargeLoading = Template.bind({})
PrimaryLargeLoading.args = {
  variant: "primary",
  size: "large",
  loading: true,
  children: "Loading",
}

export const PrimaryMedium = Template.bind({})
PrimaryMedium.args = {
  variant: "primary",
  size: "medium",
}

export const PrimaryMediumLoading = Template.bind({})
PrimaryMediumLoading.args = {
  variant: "primary",
  size: "medium",
  loading: true,
}

export const PrimarySmall = Template.bind({})
PrimarySmall.args = {
  variant: "primary",
  size: "small",
}

export const PrimarySmallLoading = Template.bind({})
PrimarySmallLoading.args = {
  variant: "primary",
  size: "small",
  loading: true,
}
