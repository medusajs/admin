import React, { useEffect, useState } from "react"

import { BatchJob } from "@medusajs/medusa"
import {
  useAdminBatchJob,
  useAdminCancelBatchJob,
  useAdminConfirmBatchJob,
  useAdminCreateBatchJob,
  useAdminDeleteFile,
  useAdminUploadFile,
} from "medusa-react"

import UploadModal from "../../../components/organisms/upload-modal"
import useNotification from "../../../hooks/use-notification"

/**
 * Hook returns a batch job. The endpoint is polled every 2s while the job is processing.
 */
function useImportBatchJob(batchJobId?: string) {
  const [batchJob, setBatchJob] = useState<BatchJob>()

  const isBatchJobProcessing =
    batchJob?.status === "created" || batchJob?.status === "confirmed"

  const { batch_job } = useAdminBatchJob(batchJobId!, {
    enabled: !!batchJobId,
    refetchInterval: isBatchJobProcessing ? 2000 : false,
  })

  useEffect(() => {
    setBatchJob(batch_job)
  }, [batch_job])

  return batchJob
}

/**
 * Import products container interface.
 */
type ImportPricesProps = {
  priceListId: string
  handleClose: () => void
}

/**
 * Product import modal container.
 */
function ImportPrices(props: ImportPricesProps) {
  const [fileKey, setFileKey] = useState<string | undefined>()
  const [batchJobId, setBatchJobId] = useState<string | undefined>()

  const notification = useNotification()

  const { mutateAsync: deleteFile } = useAdminDeleteFile()
  const { mutateAsync: uploadFile } = useAdminUploadFile()

  const { mutateAsync: createBatchJob } = useAdminCreateBatchJob()
  const { mutateAsync: cancelBathJob } = useAdminCancelBatchJob(batchJobId!)
  const { mutateAsync: confirmBatchJob } = useAdminConfirmBatchJob(batchJobId!)

  const batchJob = useImportBatchJob(batchJobId)

  const isUploaded = !!fileKey
  const isPreprocessed = !!batchJob?.result
  const hasError = batchJob?.status === "failed"

  const progress = isPreprocessed
    ? (batchJob!.result?.advancement_count || 0) / (batchJob!.result?.count || 1)
    : undefined

  const status = hasError
    ? "Error occurred while processing"
    : isPreprocessed
    ? undefined
    : isUploaded
    ? "Preprocessing..."
    : "Uploading..."

  /**
   * Confirm job on submit.
   */
  const onSubmit = async () => {
    await confirmBatchJob()
    notification(
      "Success",
      "Import confirmed for processing. Progress info is available in the activity drawer.",
      "success"
    )
    props.handleClose()
  }

  /**
   * Upload file and use returned file key to create a batch job.
   */
  const processUpload = async (file: File) => {
    try {
      const res = await uploadFile(file as any)
      const _fileKey = res.uploads![0].key
      setFileKey(_fileKey)

      const batchJob = await createBatchJob({
        dry_run: true,
        context: { fileKey: _fileKey, price_list_id: props.priceListId },
        type: "price-list-import",
      })

      setBatchJobId(batchJob.batch_job.id)
    } catch (e) {
      notification("Error", "Import failed.", "error")
      if (fileKey) {
        await deleteFile({ file_key: fileKey })
      }
    }
  }

  /**
   * Returns create/update counts from stat descriptor.
   */
  const getSummary = (): { toCreate: number } | undefined => {
    if (!batchJob) {
      return undefined
    }

    const res = batchJob.result?.stat_descriptors![0].message.match(/\d+/g)

    if (!res) {
      return undefined
    }

    return {
      toCreate: Number(res[0]),
    }
  }

  /**
   * When file upload is removed, delete file from the bucket and cancel batch job.
   */
  const onFileRemove = async () => {
    try {
      if (fileKey) {
        deleteFile({ file_key: fileKey })
      }
      cancelBathJob()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Cleanup file if batch job isn't confirmed.
   */
  const onClose = () => {
    props.handleClose()
    if (
      !["confirmed", "completed", "canceled", "failed"].includes(
        batchJob?.status || ""
      )
    ) {
      if (fileKey) {
        deleteFile({ file_key: fileKey })
      }
      if (batchJobId) {
        cancelBathJob()
      }
    }
  }

  return (
    <UploadModal
      type="prices"
      fileTitle="price list"
      description1Text="You can add to or 'update' a price list. A new import will update products with the same SKU. New products will be implemented as Drafts. Updated products will keep their current status."
      description2Title="Unsure about how to arrange your list?"
      description2Text="We have created a template file for you. Type in your own information and experience how much time and frustration this functionality can save you. Feel free to reach out if you have any questions."
      status={status}
      progress={progress}
      canImport={isPreprocessed}
      onSubmit={onSubmit}
      onClose={onClose}
      summary={getSummary()}
      onFileRemove={onFileRemove}
      processUpload={processUpload}
      templateLink="/temp/price-list-import-template.csv"
    />
  )
}

export default ImportPrices

