import useNotification from "../../../hooks/use-notification"
import { useAdminCancelBatchJob } from "medusa-react"
import React, { useEffect } from "react"
import { getErrorMessage } from "../../../utils/error-messages"
import getRelativeTime from "../../../utils/get-human-relative-time"
import { getActivityDescriptionFromBatchJob } from "./utils"
import MedusaIcon from "../../fundamentals/icons/medusa-icon"
import Button from "../../fundamentals/button"
import DownloadableFileButton from "../../molecules/downloadable-file-button"
import Medusa from "../../../services/api"
import { BatchJob } from "@medusajs/medusa/dist"
import { bytesConverter } from "../../../utils/bytes-converter"
import { ActivityCard } from "../../molecules/activirty-card"

const BatchJobActivityList = ({ batchJobs }: { batchJobs?: BatchJob[] }) => {
  return <div>
    {
      !!batchJobs?.length && (
        batchJobs?.map(batchJob => {
          return <BatchJobActivityCard batchJob={batchJob}/>
        })
      )
    }
  </div>
}

const BatchJobActivityCard = ({ batchJob }: { batchJob: any }) => {
  const notification = useNotification()
  const { mutate: cancelBatchJob, error: cancelBatchJobError  } =
    useAdminCancelBatchJob(batchJob.id)

  const relativeTimeElapsed = getRelativeTime({
    from: new Date(),
    to: batchJob.created_at,
  })

  const canCancel = !batchJob.completed_at
    && !batchJob.failed_at
    && !batchJob.canceled_at

  const canDownload = !!batchJob.completed_at
    && !batchJob.failed_at
    && !batchJob.canceled_at
    && batchJob.result?.file_key

  useEffect(() => {
    if (cancelBatchJobError) {
      notification(
        "Error canceling the batch job",
        getErrorMessage(cancelBatchJobError),
        "error"
      )
    }
  }, [cancelBatchJobError])

  const getActivityDescription = () => {
    return getActivityDescriptionFromBatchJob(batchJob, {
      elapsedTime: relativeTimeElapsed.raw
    })
  }

  const deleteFile = () => {
    if (!batchJob.result?.file_key) return
    Medusa.uploads.delete(batchJob.result?.file_key)
      .then(() => {
        notification(
          "Success",
          "Export file has been removed",
          "success"
        )
      })
      .catch(() => {
        notification(
          "Error",
          "Something went wrong while deleting the export file",
          "error"
        )
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
        notification(
          "Error",
          "Something went wrong while downloading the export file",
          "error")
      })
  }

  const getBodyAction = () => {
    return batchJob.result?.file_key &&
      <DownloadableFileButton
        onClick={downloadFile}
        variant={"ghost"}
        fileName={batchJob.result.file_key}
        fileSize={bytesConverter(batchJob.result.file_size ?? 0)}
      />
  }

  const getFooterActions = () => {
    return (
      <div>
        {canDownload && (
          <div className="flex">
            <Button
              onClick={deleteFile}
              size={"small"}
              className="flex justify-start mt-4"
              variant={"danger"}
            >
              Delete
            </Button>
            <Button
              onClick={downloadFile}
              size={"small"}
              className="flex justify-start mt-4"
              variant={"ghost"}
            >
              Download
            </Button>
          </div>
        )}
        {canCancel && (
          <Button
            onClick={() => cancelBatchJob()}
            size={"small"}
            className="flex justify-start mt-4"
            variant={"danger"}
          >
            Cancel
          </Button>
        )}
      </div>
    )
  }

  return (
    <ActivityCard
      key={batchJob.id}
      title="Medusa Team"
      titleIcon={<MedusaIcon className="mr-3" size={20}/>}
      relativeTimeElapsed={relativeTimeElapsed.rtf}
      shouldShowStatus={true}
      description={getActivityDescription()}
      bodyActions={getBodyAction()}
      footerActions={getFooterActions()}
    />
  )
}

export default BatchJobActivityList