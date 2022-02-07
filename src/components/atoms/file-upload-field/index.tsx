import clsx from "clsx"
import React, { useRef, useState } from "react"

type FileUploadFieldProps = {
  onFileChosen: (files: any[]) => void
  filetypes: string[]
  errorMessage?: string
  placeholder?: string
  className?: string
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileChosen,
  filetypes,
  placeholder,
  errorMessage,
  className,
}) => {
  const inputRef = useRef(null)
  const [fileUploadError, setFileUploadError] = useState(false)

  const handleFileUpload = (e) => {
    onFileChosen(Array.from(e.target.files))
  }

  const handleFileDrop = (e) => {
    setFileUploadError(false)

    e.preventDefault()

    const files = []

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
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
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i])
        }
      }
    }
    if (files.length === 1) {
      onFileChosen(files)
    } else {
      setFileUploadError(true)
    }
  }

  return (
    <div
      onClick={() => inputRef?.current.click()}
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
      className={clsx(
        "flex flex-col select-none inter-base-regular text-grey-50 cursor-pointer items-center justify-center w-full h-full rounded-rounded border-2 border-dashed border-grey-20 transition-colors hover:border-violet-60 hover:text-grey-40",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <p>
          Drop your images here, or{" "}
          <span className="text-violet-60">click to browse</span>
        </p>
        {placeholder}
      </div>
      {fileUploadError && (
        <span className="text-rose-60">
          {errorMessage || "Please upload an image file"}
        </span>
      )}
      <input
        ref={inputRef}
        accept={filetypes.join(", ")}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

export default FileUploadField
