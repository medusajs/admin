import { User } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useQueryClient } from "react-query"
import useNotification from "../../../hooks/use-notification"
import { useAdminCreateAnalyticsConfig } from "../../../services/analytics"
import { getErrorMessage } from "../../../utils/error-messages"
import Switch from "../../atoms/switch"
import Button from "../../fundamentals/button"
import FocusModal from "../../molecules/modal/focus-modal"

type AnalyticsPreferencesFormType = {
  anonymize: boolean
  opt_out: boolean
}

type Props = {
  user: Omit<User, "password_hash">
}

const AnalyticsPreferencesModal = ({ user }: Props) => {
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateAnalyticsConfig()
  const { control, setValue, handleSubmit } = useForm<
    AnalyticsPreferencesFormType
  >({
    defaultValues: {
      anonymize: false,
      opt_out: false,
    },
  })

  const watchOptOut = useWatch({
    control,
    name: "opt_out",
  })

  useEffect(() => {
    setValue("anonymize", false)
  }, [watchOptOut])

  const queryClient = useQueryClient()

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        notification(
          "Success",
          "Your preferences was successfully updated",
          "success"
        )
        queryClient.invalidateQueries("analytics")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  })

  return (
    <FocusModal>
      <FocusModal.Header></FocusModal.Header>
      <FocusModal.Main>
        <div className="flex flex-col items-center">
          <div className="mt-5xlarge flex flex-col max-w-[664px] w-full">
            <h1 className="inter-xlarge-semibold mb-large">
              Help us get better
            </h1>
            <p className="text-grey-50">
              To create the most compelling e-commerce experience we would like
              to gain insights in how you use Medusa. User insights allow us to
              build a better, more engaging, and more usable products. We only
              collect data for product improvements. Read what data we gather in
              our{" "}
              <a
                href="https://docs.medusajs.com/usage"
                rel="noreferrer noopener"
                target="_blank"
                className="text-violet-60"
              >
                documentation
              </a>
              .
            </p>
            <div className="flex flex-col gap-y-xlarge mt-xlarge">
              <div
                className={clsx("flex items-start transition-opacity", {
                  "opacity-50": watchOptOut,
                })}
              >
                <div className="flex flex-col flex-1 gap-y-2xsmall">
                  <h2 className="inter-base-semibold">
                    Anonymize my usage data
                  </h2>
                  <p className="inter-base-regular text-grey-50">
                    You can choose to anonymize your usage data. If this option
                    is selected, we will not collect your personal information,
                    including your name and email address.
                  </p>
                </div>
                <Controller
                  name="anonymize"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        disabled={watchOptOut}
                      />
                    )
                  }}
                />
              </div>
              <div className="flex items-start">
                <div className="flex flex-col flex-1 gap-y-2xsmall">
                  <h2 className="inter-base-semibold">
                    Opt out of sharing my usage data
                  </h2>
                  <p className="inter-base-regular text-grey-50">
                    You can always opt out of sharing your usage data at any
                    time.
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
            </div>
            <div className="flex items-center justify-end mt-5xlarge">
              <Button
                variant="primary"
                size="small"
                loading={isLoading}
                onClick={onSubmit}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default AnalyticsPreferencesModal
