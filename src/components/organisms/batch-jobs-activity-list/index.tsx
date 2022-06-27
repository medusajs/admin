import useNotification from "../../../hooks/use-notification"
import { useAdminCancelBatchJob } from "medusa-react"
import React, { useEffect } from "react"
import { getErrorMessage } from "../../../utils/error-messages"
import getRelativeTime from "../../../utils/get-human-relative-time"
import { getActivityDescriptionFromBatchJob } from "./utils"
import MedusaIcon from "../../fundamentals/icons/medusa-icon"
import StatusIndicator from "../../fundamentals/status-indicator"
import Button from "../../fundamentals/button"
import DownloadableFileButton from "../../molecules/downloadable-file-button"
import Medusa from "../../../services/api"
import { BatchJob } from "@medusajs/medusa/dist"

const BatchJobActivityList = ({ batchJobs }: { batchJobs?: BatchJob[] }) => {
  return <div>
    {!!batchJobs?.length && (
      batchJobs?.map(batchJob => {
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

  const deleteFile = () => {
    if (!batchJob.result?.file_key) return
    Medusa.uploads.delete(batchJob.result?.file_key)
      .then(() => {
        notification("Success", "Export file has been removed", "success")
      })
      .catch(() => {
        notification("Error", "Something went wrong while deleting the export file", "error")
      })
  }

  const downloadFile = async () => {
    if (!batchJob.result?.file_key) return
    Medusa.uploads.downloadUrl(batchJob.result?.file_key)
      .then((response) => {
        const link = document.createElement("a");
        link.href = response.data.download_url;
        link.setAttribute(
            "download",
            `${batchJob.result?.file_key}`
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      })
      .catch(() => {
        notification("Error", "Something went wrong while downloading the export file", "error")
      })
  }

  return (
    <div key={batchJob.id} className="flex p-4 hover:bg-grey-5 border-b border-grey-20">
      <div className="relative w-full h-full">
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
            <DownloadableFileButton
              onClick={downloadFile}
              variant={"ghost"}
              fileName={batchJob.result.file_key}
              fileSize={batchJob.result.file_size}
            />
          )}
        </div>

        <div className="flex ml-8">
          {canDownload && (
            <div className="flex">
              <Button onClick={deleteFile} size={"small"} className="flex justify-start mt-4" variant={"danger"}>
                  Delete
              </Button>
              <Button onClick={downloadFile} size={"small"} className="flex justify-start mt-4" variant={"ghost"}>
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