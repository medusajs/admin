import React, { useState } from "react"
import ReactJson from "react-json-view"
import * as Collapsible from "@radix-ui/react-collapsible"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import Button from "../../fundamentals/button"
import ClipboardCopyIcon from "../../fundamentals/icons/clipboard-copy-icon"
import clsx from "clsx"
import useClipboard from "../../../hooks/use-clipboard"

type ViewRawProps = {
  raw: object
  title?: string
}

const ViewRaw: React.FC<ViewRawProps> = ({ raw, title = "Data" }) => {
  const [expanded, setExpanded] = useState(false)
  const [isCopied, handleCopy] = useClipboard(
    JSON.stringify(raw, undefined, 2),
    {
      successDuration: 5500,
      onCopied: () => {},
    }
  )

  return (
    <div className="px-base py-xsmall rounded-rounded bg-grey-5">
      <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
        <Collapsible.Trigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <p className="inter-base-semibold">
              {title}{" "}
              <span className="inter-base-regular text-grey-50">
                ({Object.keys(raw).length})
              </span>
            </p>
            <Button variant="ghost" size="small" className="text-grey-50">
              <ChevronDownIcon
                size={20}
                className={clsx("text-grey-50", {
                  "rotate-180": expanded,
                })}
              />
            </Button>
          </div>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="mt-xsmall">
            <ReactJson
              src={raw}
              enableClipboard={false}
              shouldCollapse={false}
              style={{
                fontFamily: "Roboto Mono",
                fontSize: "12px",
              }}
            />
          </div>
          <div className="flex items-center justify-end w-full gap-x-xsmall text-grey-50 inter-small-regular">
            {isCopied && <span className="animate-fade-in-right">Copied!</span>}
            <Button
              variant="ghost"
              size="small"
              type="button"
              onClick={handleCopy}
            >
              <ClipboardCopyIcon size={20} />
            </Button>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export default ViewRaw
