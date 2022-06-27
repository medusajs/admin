import FileIcon from "../../fundamentals/icons/file-icon"
import Button, { ButtonProps } from "../../fundamentals/button"
import React from "react"

type Props = ButtonProps & {
  fileName: string
  fileSize?: string
}

const DownloadableFileButton = ({ fileName, fileSize, ...buttonProps }: Props) => {
  return (
    <Button
      className="flex justify-start mt-4" {...buttonProps}
      title={fileName}
    >
      <FileIcon size={30}/>
      <div className="flex flex-col text-left">
        <span className="overflow-hidden truncate w-4/5 inter-base-regular">
          {fileName}
        </span>

        {!!fileSize && (
          <span className="text-grey-40 inter-base-regular">{fileSize}</span>
        )}
      </div>
    </Button>
  )
}

export default DownloadableFileButton