import * as Dialog from "@radix-ui/react-dialog"
import React from "react"

type DangerModalProps = {
  dangerousAction?: () => void
  message: string
  title: string
}

const DangerModal: React.FC<DangerModalProps> = ({
  dangerousAction,
  message,
  title,
}) => {
  return (
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed bg-grey-90/40 z-50 grid top-0 left-0 right-0 bottom-0 place-items-center overflow-y-auto">
          <Dialog.Content className="bg-grey-0 min-w-modal rounded">
            <h1 className="inter-large-semibold mb-2xsmall">{title}</h1>
            <p className="inter-base-regular text-grey-50">{message}</p>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
      <Dialog.Close>
        <button className="rounded-base bg-grey-0 inter-small-semibold py-[6px] px-base">
          No, cancel
        </button>
        <button className="rounded-base bg-rose-50 inter-small-semibold py-[6px] px-base">
          Yes, delete
        </button>
      </Dialog.Close>
    </Dialog.Root>
  )
}

export default DangerModal
