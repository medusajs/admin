import { useAdminResendNotification } from "medusa-react"
import {
  useAdminCreateClaimShipment,
  useAdminCreateShipment,
  useAdminCreateSwapShipment,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useToaster from "../../../../hooks/use-toaster"
import { getErrorMessage } from "../../../../utils/error-messages"

type ResendModalProps = {
  notificationId: string
  email: string
  handleCancel: () => void
}

const ResendModal: React.FC<ResendModalProps> = ({
  notificationId,
  email,
  handleCancel,
}) => {
  const resendNotification = useAdminResendNotification(notificationId)

  const { register, handleSubmit } = useForm({
    defaultValues: { to: email },
  })

  const toaster = useToaster()

  const handleResend = (data) => {
    resendNotification.mutate(
      {
        to: data.to.trim(),
      },
      {
        onSuccess: () => {
          toaster(`Notification re-send to ${data.to}`, "success")
          handleCancel()
        },
        onError: (err) => toaster(getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <Modal handleClose={handleCancel}>
      <form onSubmit={handleSubmit(handleResend)}>
        <Modal.Body>
          <Modal.Header handleClose={handleCancel}>
            <span className="inter-xlarge-semibold">Resend notification</span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <div className="flex flex-col space-y-2">
                <Input
                  label={"Email"}
                  type="text"
                  placeholder={"Email"}
                  name={`to`}
                  ref={register({
                    required: "Must be filled",
                  })}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <div className="flex">
                <Button
                  variant="ghost"
                  className="mr-2 w-32 text-small justify-center"
                  size="large"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  className="w-32 text-small justify-center"
                  variant="primary"
                  type="submit"
                >
                  Send
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default ResendModal
