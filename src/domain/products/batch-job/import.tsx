import React, { useContext, useEffect, useState } from "react"

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
import { PollingContext } from "../../../context/polling"

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
type ImportProductsProps = {
  handleClose: () => void
}

/**
 * Product import modal container.
 */
function ImportProducts(props: ImportProductsProps) {
  const [fileKey, setFileKey] = useState()
  const [batchJobId, setBatchJobId] = useState()

  const notification = useNotification()

  const { resetInterval } = useContext(PollingContext)

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
    ? batchJob!.result.advancement_count / batchJob!.result.count
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
      const _fileKey = res.uploads[0].key
      setFileKey(_fileKey)

      const batchJob = await createBatchJob({
        dry_run: true,
        context: { fileKey: _fileKey },
        type: "product-import",
      })

      resetInterval()

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
  const getSummary = () => {
    if (!batchJob) {
      return undefined
    }

    const res = batchJob.result?.stat_descriptors[0].message.match(/\d+/g)

    if (!res) {
      return undefined
    }

    return {
      toCreate: Number(res[0]),
      toUpdate: Number(res[1]),
    }
  }

  /**
   * When file upload is removed, delete file from the bucket and cancel batch job.
   */
  const onFileRemove = async () => {
    if (fileKey) {
      try {
        deleteFile({ file_key: fileKey })
      } catch (e) {
        notification("Error", "Failed to delete the CSV file", "error")
      }
    }

    try {
      cancelBathJob()
    } catch (e) {
      notification("Error", "Failed to cancel the batch job", "error")
    }

    setBatchJobId(undefined)
  }

  /**
   * Cleanup file if batch job isn't confirmed.
   */
  const onClose = () => {
    props.handleClose()
    if (
      !["confirmed", "completed", "canceled", "failed"].includes(
        batchJob?.status
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
      type="products"
      status={status}
      progress={progress}
      canImport={isPreprocessed}
      onSubmit={onSubmit}
      onClose={onClose}
      summary={getSummary()}
      onFileRemove={onFileRemove}
      processUpload={processUpload}
      fileTitle={"products list"}
      templateLink="/temp/product-import-template.csv"
      description2Title="Unsure about how to arrange your list?"
      description2Text="Download the template below to ensure you are following the correct format."
      description1Text="Through imports you can add or update products. To update existing products/variants you must set an existing id in the Product/Variant id columns. If the value is unset a new record will be created. You will be asked for confirmation before we import products."
    />
  )
}

export default ImportProducts
