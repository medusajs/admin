import { AnalyticsConfig, User } from "@medusajs/medusa"
import { useAdminGetSession } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { useAdminUpdateAnalyticsConfig } from "../../../../services/analytics"

type Props = {
  user: Omit<User, "password_hash">
  config: AnalyticsConfig
  open: boolean
  onClose: () => void
}

type UsageInsightsFormType = {
  opt_out: boolean
  anonymize: boolean
}

const UsageInsightsModal = ({ user, config, open, onClose }: Props) => {
  const { mutate, isLoading: isSubmitting } = useAdminUpdateAnalyticsConfig(
    user.id
  )
  const { refetch } = useAdminGetSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UsageInsightsFormType>({
    defaultValues: {
      opt_out: config.opt_out,
      anonymize: config.anonymize,
    },
  })

  useEffect(() => {
    reset({
      opt_out: config.opt_out,
      anonymize: config.anonymize,
    })
  }, [open, user])

  const notification = useNotification()

  const onSubmit = handleSubmit((data) => {
    mutate(
      // @ts-ignore
      data,
      {
        onSuccess: () => {
          notification(
            "Success",
            "Your information was successfully updated",
            "success"
          )
          refetch()
          onClose()
        },
        onError: () => {},
      }
    )
  })

  return (
    <Modal handleClose={onClose} open={open} isLargeModal={false}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Edit information</h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content></Modal.Content>
        <Modal.Footer className="border-t border-grey-20 pt-base">
          <div className="flex items-center justify-end gap-x-xsmall w-full">
            <Button variant="secondary" size="small">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              Submit and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default UsageInsightsModal
