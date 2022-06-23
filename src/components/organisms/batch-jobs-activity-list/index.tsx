import useNotification from "../../../hooks/use-notification"
import { useAdminBatchJobs, useAdminCancelBatchJob } from "medusa-react"
import React, { useEffect, useState } from "react"
import { getErrorMessage } from "../../../utils/error-messages"
import getRelativeTime from "../../../utils/get-human-relative-time"
import { getActivityDescriptionFromBatchJob } from "./utils"
import MedusaIcon from "../../fundamentals/icons/medusa-icon"
import StatusIndicator from "../../fundamentals/status-indicator"
import Button from "../../fundamentals/button"
import FileIcon from "../../fundamentals/icons/file-icon"
import { AdminGetBatchParams } from "@medusajs/medusa"

const BatchJobActivityList = () => {
  const notification = useNotification()
  const [shouldPollBatchJobs, setShouldPollBatchJobs] = useState(true)
  const {
    batch_jobs,
    error: listBatchJobsError
  } = useAdminBatchJobs({} as AdminGetBatchParams, {
    refetchInterval: shouldPollBatchJobs ? 5000 : false,
    refetchIntervalInBackground: shouldPollBatchJobs
  } as any)

  useEffect(() => {
    if (batch_jobs?.length) {
      const shouldPoll = batch_jobs.some((batch: any): boolean => {
        return (!!batch.pre_processed_at || !!batch.processing_at)
        && !batch.completed
        && !batch.failed_at
        && !batch.canceled_at
      })
      setShouldPollBatchJobs(shouldPoll)
    }

    if (listBatchJobsError) {
      notification("Error listing the batch jobs", getErrorMessage(listBatchJobsError), "error")
    }
  }, [batch_jobs, listBatchJobsError])

  return <div>
    <div className="inter-xlarge-semibold p-4">Activities</div>

    {batch_jobs?.length && (
      batch_jobs?.map(batchJob => {
        return <BatchJobActivityCard batchJob={batchJob}/>
      })
    )}
  </div>
}

const BatchJobActivityCard = ({ batchJob }: { batchJob: any }) => {
  const notification = useNotification()
  const { mutate: cancelBatchJob, error: cancelBatchJobError,  } = useAdminCancelBatchJob(batchJob.id)

  useEffect(() => {
    if (cancelBatchJobError) {
      notification("Error canceling the batch job", getErrorMessage(cancelBatchJobError), "error")
    }
  }, [cancelBatchJobError])

  const relativeTimeElapsed = getRelativeTime({
    from: new Date(),
    to: batchJob.created_at,
  })

  const canCancel = !batchJob.completed_at && !batchJob.failed_at && !batchJob.canceled_at
  const canDownload = !!batchJob.completed_at && !batchJob.failed_at && !batchJob.canceled_at && batchJob.result?.file_key

  const getActivityDescription = () => {
    return getActivityDescriptionFromBatchJob(batchJob, {
      elapsedTime: relativeTimeElapsed.raw
    })
  }

  return (
    <div className="flex p-4 hover:bg-grey-5 border-b border-grey-20">
      <div className="">
        <div className="flex justify-between inter-base-semibold">
          <div className="flex">
            <MedusaIcon className="mr-3" size={20}/>
            <span>Medusa Team</span>
          </div>

          <div className="flex">
            <span>{relativeTimeElapsed.rtf}</span>
            <StatusIndicator variant={"primary"} className="ml-2"/>
          </div>
        </div>

        <div className="flex flex-col ml-8">
          <span>{getActivityDescription()}</span>

          {batchJob.result?.file_key && (
            <Button className="flex justify-start mt-4" variant={"ghost"}>
              <FileIcon size={30}/>
              <div className="flex flex-col text-left">
                <span>{batchJob.result.file_key}</span>
                <span className="text-grey-40">956 kb</span>
              </div>
            </Button>
          )}
        </div>

        <div className="flex ml-8">
          {canDownload && (
            <div className="flex">
              <Button size={"small"} className="flex justify-start mt-4" variant={"danger"}>
                  Delete
              </Button>
              <Button size={"small"} className="flex justify-start mt-4" variant={"ghost"}>
                  Download
              </Button>
            </div>
          )}
          {canCancel && (
            <Button onClick={() => cancelBatchJob()} size={"small"} className="flex justify-start mt-4" variant={"danger"}>
                Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BatchJobActivityList