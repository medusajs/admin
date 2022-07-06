import { BatchJob } from "@medusajs/medusa/dist"
import clsx from "clsx"
import {
  useAdminCancelBatchJob,
  useAdminCreatePresignedDownloadUrl,
  useAdminDeleteFile,
  useAdminStore,
} from "medusa-react"
import React, { useEffect, useRef } from "react"
import useNotification from "../../../hooks/use-notification"
import { bytesConverter } from "../../../utils/bytes-converter"
import { getErrorMessage } from "../../../utils/error-messages"
import getRelativeTime from "../../../utils/get-relative-time"
import Spinner from "../../atoms/spinner"
import Button, { ButtonProps } from "../../fundamentals/button"
import FileIcon from "../../fundamentals/icons/file-icon"
import MedusaIcon from "../../fundamentals/icons/medusa-icon"
import { ActivityCard } from "../../molecules/activity-card"
import BatchJobFileCard from "../../molecules/batch-job-file-card"
import { batchJobDescriptionBuilder } from "./utils"

const BatchJobActivityList = ({ batchJobs }: { batchJobs?: BatchJob[] }) => {
  return (
    <div>
      {batchJobs?.map((batchJob) => {
        return <BatchJobActivityCard key={batchJob.id} batchJob={batchJob} />
      })}
    </div>
  )
}

const BatchJobActivityCard = ({ batchJob }: { batchJob: BatchJob }) => {
  const activityCardRef = useRef<HTMLDivElement>(null)
  const notification = useNotification()
  const { store } = useAdminStore()
  const {
    mutate: cancelBatchJob,
    error: cancelBatchJobError,
  } = useAdminCancelBatchJob(batchJob.id)
  const { mutateAsync: deleteFile } = useAdminDeleteFile()
  const {
    mutateAsync: createPresignedUrl,
  } = useAdminCreatePresignedDownloadUrl()

  const fileName = batchJob.result?.file_key ?? `${batchJob.type}.csv`
  const relativeTimeElapsed = getRelativeTime({
    from: new Date(),
    to: batchJob.created_at,
  })

  const batchJobActivityDescription = batchJobDescriptionBuilder(
    batchJob,
    relativeTimeElapsed.raw
  )

  const canCancel =
    batchJob.status !== "completed" &&
    batchJob.status !== "failed" &&
    batchJob.status !== "canceled"

  const canDownload =
    batchJob.status === "completed" && batchJob.result?.file_key

  useEffect(() => {
    if (cancelBatchJobError) {
      notification(
        "Error canceling the batch job",
        getErrorMessage(cancelBatchJobError),
        "error"
      )
    }
  }, [cancelBatchJobError])

  const onDownloadFile = async () => {
    if (!batchJob.result?.file_key) {
      return
    }

    try {
      const { download_url } = await createPresignedUrl({
        file_key: batchJob.result?.file_key,
      })
      const link = document.createElement("a")
      link.href = download_url
      link.setAttribute("download", `${batchJob.result?.file_key}`)
      activityCardRef.current?.appendChild(link)
      link.click()

      activityCardRef.current?.removeChild(link)
    } catch (e) {
      notification(
        "Error",
        "Something went wrong while downloading the export file",
        "error"
      )
    }
  }

  const onDeleteFile = async () => {
    if (!batchJob.result?.file_key) {
      return
    }

    try {
      await deleteFile({ file_key: batchJob.result?.file_key })
      notification("Success", "Export file has been removed", "success")
    } catch (e) {
      notification(
        "Error",
        "Something went wrong while deleting the export file",
        "error"
      )
    }
  }

  const getBatchJobFileCard = () => {
    const twentyfourHoursInMs = 24 * 60 * 60 * 1000

    const iconColor =
      Math.abs(relativeTimeElapsed.raw) > twentyfourHoursInMs
        ? "#9CA3AF"
        : undefined

    const icon =
      batchJob.status !== "completed" && batchJob.status !== "canceled" ? (
        <Spinner size={"medium"} variant={"secondary"} />
      ) : (
        <FileIcon fill={iconColor} size={20} />
      )

    const fileSize =
      batchJob.status !== "canceled"
        ? batchJob.result?.file_key
          ? bytesConverter(batchJob.result?.file_size ?? 0)
          : "Preparing export..."
        : undefined

    return (
      <BatchJobFileCard
        onClick={onDownloadFile}
        fileName={fileName}
        icon={icon}
        fileSize={fileSize}
      />
    )
  }

  const getFooterActions = () => {
    const buildButton = (
      onClick: ButtonProps["onClick"],
      variant: ButtonProps["variant"],
      text: string,
      className?: string
    ) => {
      return (
        <Button
          onClick={onClick}
          size={"small"}
          className={clsx("flex justify-start inter-small-regular", className)}
          variant={variant}
        >
          {text}
        </Button>
      )
    }
    return (
      (canDownload || canCancel) && (
        <div className="flex mt-6">
          {canDownload && (
            <div className="flex">
              {buildButton(onDeleteFile, "danger", "Delete")}
              {buildButton(onDownloadFile, "ghost", "Download", "ml-2")}
            </div>
          )}
          {canCancel && buildButton(() => cancelBatchJob(), "danger", "Cancel")}
        </div>
      )
    )
  }

  return (
    <ActivityCard
      title={store?.name ?? "Medusa Team"}
      icon={<MedusaIcon className="mr-3" size={20} />}
      relativeTimeElapsed={relativeTimeElapsed.rtf}
      date={batchJob.created_at}
      shouldShowStatus={true}
    >
      <div ref={activityCardRef} className="flex flex-col inter-small-regular">
        <span>{batchJobActivityDescription}</span>

        {getBatchJobFileCard()}
      </div>

      {getFooterActions()}
    </ActivityCard>
  )
}

export default BatchJobActivityList
