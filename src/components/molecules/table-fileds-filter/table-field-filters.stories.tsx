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
    {
      id: "p-usd",
      short: "Price USD",
      label: (
        <span className="text-small text-grey-50">
          <span className="font-semibold text-grey-90">USD</span> (USA)
        </span>
      ),
    },
    {
      id: "p-dkk",
      short: "Price DKK",
      label: (
        <span className="text-small text-grey-50">
          <span className="font-semibold text-grey-90">DKK</span> (Denmark)
        </span>
      ),
    },
    {
      id: "p-hrk",
      short: "Price HRK",
      label: (
        <span className="text-small text-grey-50">
          <span className="font-semibold text-grey-90">HRK</span> (Coratia)
        </span>
      ),
    },
  ],
}
