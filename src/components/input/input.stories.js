import React from "react"
import { storiesOf } from "@storybook/react"
import InputField from "./index"

export default {
  title: `Input`,
}

export const Primary = () => (
  <InputField label="Default" width={350} height={30} />
)

export const Inline = () => (
  <div style={{ width: "500px" }}>
    <InputField inline label="Inline" width={350} height={30} />
  </div>
)

export const WithTooltip = () => {
  return (
    <div style={{ marginTop: 80, display: "flex", justifyContent: "center" }}>
      <InputField
        label="Default"
        width={350}
        withTooltip
        tooltipText="This is a tooltip"
      />
    </div>
  )
}
