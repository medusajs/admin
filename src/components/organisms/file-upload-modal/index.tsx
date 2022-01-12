import React, { useRef, useState } from "react"
import Modal from "../../molecules/modal"

type FileUploadModalProps = {
  setFiles: (files: any[]) => void
  handleClose: () => void
  filetypes: string[]
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  handleClose,
  filetypes,
  setFiles,
}) => {
  const [fileUploadError, setFileUploadError] = useState(false)
  const inputRef = useRef(null)

  const handleFileUpload = e => {
    setFiles(e.target.files)
  }
  const handleFileDrop = e => {
    setFileUploadError(false)

    e.preventDefault()

    const files = []

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile()
          if (filetypes.indexOf(file.type) > -1) {
            files.push(file)
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i])
        }
      }
    }
    if (files.length === 1) {
      setFiles(files)
    } else {
      setFileUploadError(true)
    }
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Upload a new photo</span>
        </Modal.Header>
        <Modal.Content>
          <div
            onClick={() => inputRef?.current.click()}
            onDrop={handleFileDrop}
            onDragOver={e => e.preventDefault()}
            className="flex flex-col inter-base-regular text-grey-50 cursor-pointer items-center justify-center w-full h-96 rounded-rounded border-2 border-dashed border-grey-20 transition-colors hover:border-violet-60 hover:text-grey-40"
          >
            <span>Drag and drop an image here, or click to select a file</span>
            {fileUploadError && (
              <span className="text-rose-60">Please upload an image file</span>
            )}
            <input
              ref={inputRef}
              accept={filetypes.join(", ")}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Modal.Content>
      </Modal.Body>
    </Modal>
  )
}

export default FileUploadModal
