import React from "react"
import * as Switch from "@radix-ui/react-switch"

type P = {
  checked: boolean
}

export default function (props: P) {
  return (
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
  )
}
