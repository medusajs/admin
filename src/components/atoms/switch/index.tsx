import React from "react"
import clsx from "clsx"
import * as RadixSwitch from "@radix-ui/react-switch"

/**
 * A controlled switch component atom.
 */
function Switch(props: RadixSwitch.SwitchProps) {
  const { checked } = props

  return (
    <RadixSwitch.Root
      {...props}
      className={clsx("w-8 h-[18px] rounded-full transition-bg", {
        "bg-gray-300": !checked,
        "bg-violet-60": checked,
      })}
    >
      <RadixSwitch.Thumb
        className={clsx(
          "w-2 h-2 bg-white rounded-full block transition-transform",
          {
            "translate-x-[5px] ": !checked,
            "translate-x-[19px] bg-violet-60": checked,
          }
        )}
      />
    </RadixSwitch.Root>
  )
}

export default Switch
