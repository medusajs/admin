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

type ImportProductsProps = {
  handleClose: () => void
  isModalOpen: boolean
}

function ImportProducts(props: ImportProductsProps) {
  const { isModalOpen, handleClose } = props

  const [fileKey, setFileKey] = useState()
  const [batchJobId, setBatchJobId] = useState()

  const notification = useNotification()

  const { mutateAsync: deleteFile } = useAdminDeleteFile()
  const { mutateAsync: uploadFile } = useAdminUploadFile()

  const { mutateAsync: createBatchJob } = useAdminCreateBatchJob()
  const { mutateAsync: cancelBathJob } = useAdminCancelBatchJob(batchJobId!)
  const { mutateAsync: confirmBatchJob } = useAdminConfirmBatchJob(batchJobId!)

  const batchJob = useImportBatchJob(batchJobId)

  const isUploaded = !!fileKey
  const isPreprocessed = !!batchJob?.result
  const progress = isPreprocessed
    ? batchJob!.result.advancement_count / batchJob!.result.count
    : undefined

  const status = isPreprocessed
    ? undefined
    : isUploaded
    ? "Preprocessing..."
    : "Uploading..."

  const onSubmit = async () => {
    await confirmBatchJob()
    notification(
      "Success",
      "Import confirmed for processing. Progress info is available in the activity drawer.",
      "success"
    )
    handleClose()
  }

  const processUpload = async (file: File) => {
    try {
      const res = await uploadFile(file)
      const _fileKey = res.uploads[0].key
      setFileKey(_fileKey)

      const batchJob = await createBatchJob({
        dry_run: true,
        context: { fileKey: _fileKey },
        type: "product-import",
      })

      setBatchJobId(batchJob.batch_job.id)
    } catch (e) {
      console.log(e)
    }
  }

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

  const onFileRemove = async () => {
    try {
      deleteFile(fileKey!)
      cancelBathJob()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      if (fileKey) {
        deleteFile(fileKey)
      }
      if (batchJobId) {
        cancelBathJob()
      }
    }
  }, [isModalOpen, fileKey, batchJobId, deleteFile, cancelBathJob])

  if (!isModalOpen) {
    return null
  }

  return (
    <UploadModal
      status={status}
      progress={progress}
      canImport={isPreprocessed}
      onSubmit={onSubmit}
      onClose={handleClose}
      summary={getSummary()}
      onFileRemove={onFileRemove}
      processUpload={processUpload}
      fileTitle={"products list"}
      description2Title="Unsure about how to arrange your list?"
      description2Text="Download the template below to ensure you are following the correct format."
      description1Text="Through imports you can add or update products. To update existing products you must use the existing handle, to update existing variants you must use the existing SKU. You will be asked for confirmation before we import products."
    />
  )
}

export default ImportProducts
