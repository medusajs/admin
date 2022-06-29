import useNotification from "../../../hooks/use-notification"
import { useAdminCancelBatchJob, useAdminStore } from "medusa-react"
import React, { useEffect } from "react"
import { getErrorMessage } from "../../../utils/error-messages"
import getRelativeTime from "../../../utils/get-relative-time"
import MedusaIcon from "../../fundamentals/icons/medusa-icon"
import Button from "../../fundamentals/button"
import BatchJobFileCard from "../../molecules/batch-job-file-card"
import Medusa from "../../../services/api"
import { BatchJob } from "@medusajs/medusa/dist"
import { bytesConverter } from "../../../utils/bytes-converter"
import { ActivityCard } from "../../molecules/activity-card"
import FileIcon from "../../fundamentals/icons/file-icon"
import Spinner from "../../atoms/spinner"
import { batchJobDescriptionBuilder } from "../../../utils/batch-job-description-builder"

const BatchJobActivityList = ({ batchJobs }: { batchJobs?: BatchJob[] }) => {
  return <div>
    {
      batchJobs?.map(batchJob => {
        return <BatchJobActivityCard key={batchJob.id} batchJob={batchJob}/>
      })
    }
  </div>
}

const BatchJobActivityCard = ({ batchJob }: { batchJob: BatchJob }) => {
  const notification = useNotification()
  const { store } = useAdminStore()
  const { mutate: cancelBatchJob, error: cancelBatchJobError  } =
    useAdminCancelBatchJob(batchJob.id)

  const relativeTimeElapsed = getRelativeTime({
    from: new Date(),
    to: batchJob.created_at,
  })

  const batchJobActivityDescription = batchJobDescriptionBuilder(
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

  const deleteFile = async () => {
    if (!batchJob.result?.file_key) {
      return
    }

    try {
      await Medusa.uploads.delete(batchJob.result?.file_key)
      notification(
        "Success",
        "Export file has been removed",
        "success"
      )
    } catch (e) {
      notification(
        "Error",
        "Something went wrong while deleting the export file",
        "error"
      )
    }
  }

  const downloadFile = async () => {
    if (!batchJob.result?.file_key) {
      return
    }

    try {
      const res = await Medusa.uploads.downloadUrl(batchJob.result?.file_key)
      const link = document.createElement("a");
      link.href = res.data.download_url;
      link.setAttribute(
          "download",
          `${batchJob.result?.file_key}`
      );
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (e) {
     notification(
      "Error",
      "Something went wrong while downloading the export file",
      "error"
     )
    }
  }

  const getBatchJobFileCard = () => {
    const twentyfourHoursInMs = 24 * 60 * 60 * 1000

    const iconColor = Math.abs(relativeTimeElapsed.raw) > twentyfourHoursInMs
      ? "#9CA3AF"
      : undefined

    const icon = (
      batchJob.status !== "completed"
      && batchJob.status !== "canceled"
    )
      ? <Spinner size={"medium"} variant={"secondary"}/>
      : <FileIcon fill={iconColor} size={20}/>

    const fileName = batchJob.result?.file_key ?? `${batchJob.type}.csv`
    const fileSize = batchJob.status !== "canceled" ? (
      batchJob.result?.file_key
        ? bytesConverter(batchJob.result?.file_size ?? 0)
        : "Preparing export..."
    ) : undefined

    return (
      <BatchJobFileCard
        onClick={downloadFile}
        fileName={fileName}
        icon={icon}
        fileSize={fileSize}
      />
    )
  }

  const getFooterActions = () => {
    return (
      (canDownload || canCancel) && (
        <div className="flex mt-6">
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

        {getBatchJobFileCard()}
      </div>

      {getFooterActions()}
    </ActivityCard>
  )
}

export default BatchJobActivityList
