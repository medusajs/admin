import React, { useEffect } from "react"
import useOutsideClick from "../../../hooks/use-outside-click"
import BatchJobActivityList from "../batch-jobs-activity-list"

const ActivityDrawer = ({ onDismiss }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const clickOutside = useOutsideClick({ ref })

  useEffect(() => {
    if (clickOutside) {
      return onDismiss()
    }
  }, [clickOutside])

  return (
    <div
      ref={ref}
      className="bg-grey-0 w-[400px] shadow-dropdown rounded-rounded top-[64px] bottom-2 right-3 rounded overflow-x-hidden fixed flex flex-col"
    >
      <BatchJobActivityList />
    </div>
  )
}

export default ActivityDrawer
