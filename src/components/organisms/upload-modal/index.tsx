import React, { ReactNode, useState } from "react"

import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import clsx from "clsx"
import FileIcon from "../../fundamentals/icons/file-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import DownloadIcon from "../../fundamentals/icons/download-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import WarningCircle from "../../fundamentals/icons/warning-circle"

type AddManuallyButtonProps = { text: string }

/**
 * "Add manually" component.
 */
function AddManuallyButton(props: AddManuallyButtonProps) {
  return (
    <div
      className="flex justify-center items-center gap-2
        font-semibold
        text-small
        rounded-xl border border-1 p-2"
      role="button"
    >
      <PlusIcon size={18} />
      <span>{props.text}</span>
    </div>
  )
}

type FileSummaryProps = {
  name: string
  size: number
  action: ReactNode
  progress?: number
}

/**
 * Render an upload file summary (& upload progress).
 */
function FileSummary(props: FileSummaryProps) {
  const { action, name, progress, size } = props

  const formattedSize = `${(size / 1000000).toFixed(2)} MB`

  return (
    <div className="relative">
      <div
        style={{ width: `${progress}%` }}
        className="absolute bg-grey-5 h-full transition-width duration-150 ease-in-out"
      />
      <div className="relative flex items-center rounded-xl border border-1 mt-6">
        <div className="m-4">
          <FileIcon size={30} fill={progress ? "#9CA3AF" : "#2DD4BF"} />
        </div>

        <div className="flex-1 my-6">
          <div className="text-small leading-5 text-grey-90">{name}</div>
          <div className="text-xsmall leading-4 text-grey-50">
            {progress ? "Uploading..." : formattedSize}
          </div>
        </div>

        <div className="m-6">{action}</div>
      </div>
    </div>
  )
}

type UploadSummaryProps = {
  products: number
  updates: number
  rejections: number
}

/**
 * Render a batch update request summary.
 */
function UploadSummary(props: UploadSummaryProps) {
  const { products, updates, rejections } = props
  return (
    <div className="flex gap-6">
      <div className="flex items-center text-small text-grey-90">
        <CheckCircleIcon color="#9CA3AF" className="mr-2" />
        <span className="font-semibold"> {products}&nbsp;</span> products
      </div>
      <div className="flex items-center text-small text-grey-90">
        <WarningCircle fill="#9CA3AF" className="mr-2" />
        <span className="font-semibold">{updates}&nbsp;</span> updates
      </div>
      <div className="flex items-center text-small text-grey-90">
        <XCircleIcon color="#9CA3AF" className="mr-2" />
        <span className="font-semibold">{rejections}&nbsp;</span> rejections
      </div>
    </div>
  )
}

type DropAreaProps = {
  fileTitle: string
  onUpload: (d: DataTransferItem) => void
}

/**
 * Component handles an CSV file drop.
 */
function DropArea(props: DropAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.items?.length) {
      props.onUpload(e.dataTransfer.items[0].getAsFile())
    }
  }

  const handleFileSelect = (e) => {
    props.onUpload(e.target.files[0])
  }

  const onDragOver = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <div
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={onDragOver}
      onDrop={handleFileDrop}
      className={clsx(
        "flex flex-col justify-center items-center border border-dashed rounded-xl mt-3 p-6",
        { "opacity-50": isDragOver }
      )}
    >
      <span className="text-grey-50 text-small">
        Drop your {props.fileTitle} file here, or
        <a className="text-violet-60">
          <label className="cursor-pointer" htmlFor="upload-form-file">
            {" "}
            click to browse.
          </label>
          <input
            type="file"
            id="upload-form-file"
            className="hidden"
            // multiple
            accept="text/csv"
            onChange={handleFileSelect}
          />
        </a>
      </span>
      <span className="text-grey-40 text-small">
        Only .csv files are supported.
      </span>
    </div>
  )
}

type UploadModalProps = {
  fileTitle: string
  actionButtonText: string
  description1Text: string
  description2Title: string
  description2Text: string
  onUploadComplete: () => void
  onClose: () => void
}

/**
 * Upload prices modal.
 */
function UploadModal(props: UploadModalProps) {
  const {
    actionButtonText,
    description1Text,
    description2Text,
    description2Title,
    fileTitle,
    onUploadComplete,
    onClose,
  } = props
  // TODO: remove hardcoded progress
  const [progress, setProgress] = useState<number>(20)
  const [uploadFile, setUploadFile] = useState<File>()

  const { name, size } = uploadFile || {}

  const onUpload = (f) => {
    setUploadFile(f)
    onUploadComplete()
  }

  const removeFile = () => {
    setUploadFile(undefined)
    // TODO: call an endpoint to remove file from the processing queue
  }

  return (
    <Modal open handleClose={onClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="text-2xl text-grey-90 inter-large-semibold py-4">
              Import {fileTitle}
            </span>
          </div>

          <div className="text-grey-90 text-base inter-large-semibold mb-1">
            Import {fileTitle}
          </div>

          <p className="text-grey-50 mb-4 text-base">{description1Text}</p>

          {!uploadFile ? (
            <AddManuallyButton text={actionButtonText} />
          ) : (
            <UploadSummary products={20} updates={1} rejections={4} />
          )}

          {!uploadFile ? (
            <DropArea onUpload={onUpload} />
          ) : (
            <FileSummary
              size={size!}
              name={name!}
              progress={progress}
              action={
                <a className="w-6 h-6 cursor-pointer" onClick={removeFile}>
                  <TrashIcon stroke="#9CA3AF" />
                </a>
              }
            />
          )}

          <div className="text-grey-90 text-base inter-large-semibold mt-8">
            {description2Title}
          </div>

          <p className="text-grey-50 mb-2 text-base">{description2Text}</p>

          <FileSummary
            name="medusa-template-product-list.csv"
            size={624220000}
            action={
              // TODO: download actual file on click
              <a className="w-6 h-6 cursor-pointer" onClick={console.log}>
                <DownloadIcon stroke="#9CA3AF" />
              </a>
            }
          />

          <div className="h-2" />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-between">
            <Button
              variant="secondary"
              className="mr-2 text-small justify-center"
              size="small"
              onClick={onClose}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                size="small"
                disabled={!uploadFile}
                variant="secondary"
                className="text-small text-rose-50"
                onClick={console.log}
              >
                Override existing list
              </Button>

              <Button
                size="small"
                disabled={!uploadFile}
                variant="primary"
                className="text-small"
                onClick={console.log}
              >
                Add to existing list
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default UploadModal
