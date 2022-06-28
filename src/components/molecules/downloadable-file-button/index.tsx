import Button, { ButtonProps } from "../../fundamentals/button"
import React, { ReactNode } from "react"

type Props = ButtonProps & {
  fileName: string
  fileSize?: string
  icon?: ReactNode
}

const DownloadableFileButton = ({ fileName, fileSize, icon, ...attributes }: Props) => {
  return (
    <Button
      {...attributes}
      className={"flex justify-start inter-small-regular" + attributes.className}
      title={fileName}
    >
      {!!icon && icon}

      <div className="text-left">
        <div className="overflow-hidden truncate max-w-[90%] inter-small-regular">
          {fileName}
        </div>

        {!!fileSize && (
          <div className="text-grey-40 inter-small-regular">
            {fileSize}
          </div>
        )}
      </div>
    </Button>
  )
}

export default DownloadableFileButton