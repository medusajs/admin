import { ComponentMeta } from "@storybook/react"
import React from "react"
import TableFieldsFilters from "./index"

export default {
  title: "Molecules/TableFieldFilters",
  component: TableFieldsFilters,
} as ComponentMeta<typeof TableFieldsFilters>

const Template = (args) => <TableFieldsFilters {...args} />

export const Default = Template.bind({})
Default.args = {
  fields: [
    { id: "p-usd", title: "Price USD" },
    { id: "p-dkk", title: "Price DKK" },
    { id: "p-hrk", title: "Price HRK" },
  ],
}
