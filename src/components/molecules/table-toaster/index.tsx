import clsx from "clsx"
import React from "react"
import { Toast } from "react-hot-toast"
import { useHotkeys } from "react-hotkeys-hook"

export type TableToasterContainerProps = {
  children: React.ReactElement[] | React.ReactElement | React.ReactNode
  toast?: Toast
}

export const TableToasterContainer = ({
  children,
  toast,
}: TableToasterContainerProps) => {
  return (
    <div
      className={clsx({
        "animate-enter": toast?.visible,
        "animate-leave": !toast?.visible,
      })}
      {...toast?.ariaProps}
    >
      <div className="flex items-center rounded-rounded bg-grey-90 px-base py-3.5">
        {children}
      </div>
    </div>
  )
}

export const HotKey = ({ label, hotKey, icon, onAction }) => {
  useHotkeys(hotKey, onAction, {})
  return (
    <div className="flex items-center gap-2">
      <span className="text-grey-0 inter-small-semibold">{label}</span>
      <div className="inter-small-semibold text-grey-30 flex items-center justify-center w-[24px] h-[24px] rounded bg-grey-70">
        {icon}
      </div>
    </div>
  )
}
