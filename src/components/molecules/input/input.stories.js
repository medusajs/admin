import React from "react"
import { storiesOf } from "@storybook/react"
import InputField from "./index"

export default {
  title: `Input`,
}

export const Primary = () => <InputField label="Default" />

export const Inline = () => (
  <div style={{ width: "500px" }}>
    <InputField label="Inline" />
  </div>
)

export const WithTooltip = () => {
  return (
    <div style={{ marginTop: 80, display: "flex", justifyContent: "center" }}>
      <InputField label="Default" withTooltip tooltipText="This is a tooltip" />
    </div>
  )
}
