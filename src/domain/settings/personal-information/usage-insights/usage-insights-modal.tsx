import { AnalyticsConfig, User } from "@medusajs/medusa"
import { useAdminGetSession } from "medusa-react"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
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
    control,
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
    <Modal handleClose={onClose} open={open} isLargeModal={true}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Edit preferences</h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col gap-y-xlarge">
            <div className="flex items-start">
              <div className="flex flex-col flex-1 gap-y-2xsmall">
                <h2 className="inter-base-semibold">Anonymize my usage data</h2>
                <p className="inter-base-regular text-grey-50">
                  We collect data only for product improvements. Read how we do
                  it in the{" "}
                  <a
                    href="https://docs.medusajs.com/usage"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="text-violet-60"
                  >
                    docs
                  </a>
                  .
                </p>
              </div>
              <Controller
                name="opt_out"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={value} onCheckedChange={onChange} />
                }}
              />
            </div>
            <div className="flex items-start">
              <div className="flex flex-col flex-1 gap-y-2xsmall">
                <h2 className="inter-base-semibold">
                  Opt out of sharing usage data
                </h2>
                <p className="inter-base-regular text-grey-50">
                  You can opt out of usage data collection at any time.
                </p>
              </div>
              <Controller
                name="anonymize"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={value} onCheckedChange={onChange} />
                }}
              />
            </div>
          </div>
        </Modal.Content>
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
