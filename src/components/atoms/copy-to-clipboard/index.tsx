import clsx from "clsx"
import React, { useEffect } from "react"
import useClipboard from "../../../hooks/use-clipboard"
import useNotification from "../../../hooks/use-notification"
import Button from "../../fundamentals/button"
import ClipboardCopyIcon from "../../fundamentals/icons/clipboard-copy-icon"

type CopyToClipboardProps = {
  value: string
  displayValue?: string
  successDuration?: number
  showValue?: boolean
  iconSize?: number
  onCopy?: () => void
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  displayValue,
  successDuration = 3000,
  showValue = true,
  iconSize = 20,
  onCopy = () => {},
}) => {
  const [isCopied, handleCopy] = useClipboard(value, {
    onCopied: onCopy,
    successDuration: successDuration,
  })
  const notification = useNotification()

  useEffect(() => {
    if (isCopied) {
      notification("Success", "Copied!", "success")
    }
  }, [isCopied, notification])

  return (
    <div className="inter-small-regular flex items-center gap-x-xsmall text-grey-50">
      <Button
        variant="ghost"
        size="small"
        type="button"
        className={clsx("p-0 text-grey-50", {
          ["text-violet-60"]: isCopied,
        })}
        onClick={handleCopy}
      >
        <ClipboardCopyIcon size={iconSize} />
      </Button>
      {showValue && (
        <span className="w-full truncate">
          {displayValue ? displayValue : value}
        </span>
      )}
    </div>
  )
}

export default CopyToClipboard
