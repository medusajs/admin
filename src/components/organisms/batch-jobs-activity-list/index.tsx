import useNotification from "../../../hooks/use-notification"
import { useAdminCancelBatchJob, useAdminStore } from "medusa-react"
import React, { useEffect } from "react"
import { getErrorMessage } from "../../../utils/error-messages"
import getRelativeTime from "../../../utils/get-human-relative-time"
import MedusaIcon from "../../fundamentals/icons/medusa-icon"
import Button from "../../fundamentals/button"
import DownloadableFileButton from "../../molecules/downloadable-file-button"
import Medusa from "../../../services/api"
import { BatchJob } from "@medusajs/medusa/dist"
import { bytesConverter } from "../../../utils/bytes-converter"
import { ActivityCard } from "../../molecules/activity-card"
import { useBatchJobDescription } from "../../../hooks/use-batch-job-description"
import FileIcon from "../../fundamentals/icons/file-icon"

const BatchJobActivityList = ({ batchJobs }: { batchJobs?: BatchJob[] }) => {
  return <div>
    {
      !!batchJobs?.length && (
        batchJobs?.map(batchJob => {
          return <BatchJobActivityCard key={batchJob.id} batchJob={batchJob}/>
        })
      )
    }
  </div>
}

const BatchJobActivityCard = ({ batchJob }: { batchJob: any }) => {
  const notification = useNotification()
  const { store } = useAdminStore()
  const { mutate: cancelBatchJob, error: cancelBatchJobError  } =
    useAdminCancelBatchJob(batchJob.id)

  const relativeTimeElapsed = getRelativeTime({
    from: new Date(),
    to: batchJob.created_at,
  })

  const batchJobActivityDescription = useBatchJobDescription(
    batchJob,
    relativeTimeElapsed.raw
  )

  const canCancel = batchJob.status !== "completed" &&
    batchJob.status !== "failed" &&
    batchJob.status !== "canceled"

  const canDownload = batchJob.status === "completed" &&
    batchJob.result?.file_key

  useEffect(() => {
    if (cancelBatchJobError) {
      notification(
        "Error canceling the batch job",
        getErrorMessage(cancelBatchJobError),
        "error"
      )
    }
  }, [cancelBatchJobError])

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
    return batchJob.result?.file_key && (
      <DownloadableFileButton
        onClick={downloadFile}
        variant={"ghost"}
        size={"small"}
        className="inter-small-regular -ml-3 p-2.5 my-1"
        fileName={batchJob.result.file_key}
        icon={<FileIcon size={40}/>}
        fileSize={bytesConverter(batchJob.result.file_size ?? 0)}
      />
    )
  }

  const getFooterActions = () => {
    return (
      <div>
        {canDownload && (
          <div className="flex">
            <Button
              onClick={deleteFile}
              size={"small"}
              className="flex justify-start inter-small-regular"
              variant={"danger"}
            >
              Delete
            </Button>
            <Button
              onClick={downloadFile}
              size={"small"}
              className="flex justify-start inter-small-regular"
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
            className="flex justify-start inter-small-regular"
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
      title={store?.name ?? "Medusa Team"}
      icon={<MedusaIcon className="mr-3" size={20}/>}
      relativeTimeElapsed={relativeTimeElapsed.rtf}
      date={batchJob.created_at}
      shouldShowStatus={true}
    >
      <div className="flex flex-col inter-small-regular">
        <span>{batchJobActivityDescription}</span>

        {getBodyAction()}
      </div>

      <div className="flex mt-1.5">
        {getFooterActions()}
      </div>
    </ActivityCard>
  )
}

export default BatchJobActivityList