import React from "react"
import clsx from "clsx"
import * as _Switch from "@radix-ui/react-switch"

/**
 * A controlled switch component atom.
 */
function Switch(props: _Switch.SwitchProps) {
  const { checked } = props

  return (
    <_Switch.Root
      {...props}
      className={clsx("w-8 h-[18px] rounded-full", {
        "bg-gray-300": !checked,
        "bg-violet-60": checked,
      })}
    >
      <_Switch.Thumb
        className={clsx("w-2 h-2 bg-white rounded-full block transition-all", {
          "translate-x-[5px] ": !checked,
          "translate-x-[19px] bg-violet-60": checked,
        })}
      />
    </_Switch.Root>
  )
}

export default Switch
