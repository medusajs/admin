import React, { useContext, useEffect, useState } from "react"
import useOutsideClick from "../../../hooks/use-outside-click"
import BatchJobActivityList from "../batch-jobs-activity-list"
import { PollingContext } from "../../../context/polling"
import SidedMouthFaceIcon from "../../fundamentals/icons/sided-mouth-face/sided-mouth-face"

const ActivityDrawer = ({ onDismiss }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const clickOutside = useOutsideClick({ ref })
  const [hasActivities, setHasActivities] = useState(false)

  const { batchJobs } = useContext(PollingContext)

  useEffect(() => {
    setHasActivities(!!batchJobs?.length)
  }, [batchJobs])

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
      <div className="inter-large-semibold p-4">Activity</div>

      {hasActivities ? (
        <BatchJobActivityList batchJobs={batchJobs} />
      ) : (
        <EmptyActivityDrawer/>
      )}
    </div>
  )
}

const EmptyActivityDrawer = () => {
  return (
    <div
      className="p-4 h-full w-full flex flex-col justify-center items-center"
    >
      <SidedMouthFaceIcon size={48}/>
      <span className={"mt-4 inter-large-semibold text-grey-90"}>
        It's quite in here...
      </span>
      <span className={"mt-4 text-grey-60 text-center"}>
        You don't have any notifications at the moment,
        but once you do they will live here.
      </span>
    </div>
  )
}

export default ActivityDrawer
