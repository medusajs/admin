import React from "react"

const OSShortcut = () => {
  const mac = "⌘"
  const win = "Ctrl +"

  const isMac = navigator?.platform?.toUpperCase().indexOf("MAC") >= 0 ?? true

  return (
    <div className="flex items-center text-grey-40">
      <p className="m-0 inter-base-semibold">
        <span className="inter-base-regular">{isMac ? mac : win}</span>K
      </p>
    </div>
  )
}

export default OSShortcut
