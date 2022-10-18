import { User } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { useAdminCreateAnalyticsConfig } from "../../../services/analytics"
import { getErrorMessage } from "../../../utils/error-messages"
import Switch from "../../atoms/switch"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import FocusModal from "../../molecules/modal/focus-modal"

type AnalyticsPreferencesFormType = {
  email: string | undefined
  anonymize: boolean
  news_updates: boolean
  security_updates: boolean
}

type Props = {
  user: Omit<User, "password_hash">
}

const AnalyticsPreferencesModal = ({ user }: Props) => {
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateAnalyticsConfig(user.id)
  const { control, register, setValue, handleSubmit } = useForm<
    AnalyticsPreferencesFormType
  >({
    defaultValues: {
      anonymize: false,
      news_updates: false,
      security_updates: false,
    },
  })

  const emailSubscriber = useWatch({
    control,
    name: "email",
  })

  useEffect(() => {
    if (!emailSubscriber) {
      ;([
        "news_updates",
        "security_updates",
        "anonymize",
      ] as (keyof AnalyticsPreferencesFormType)[]).forEach((field) => {
        setValue(field, false)
      })
    }
  }, [emailSubscriber])

  const onSubmit = handleSubmit((data) => {
    const payload = !data.email
      ? {
          opt_out: true,
        }
      : {
          opt_out: false,
          anonymize: data.anonymize,
        }

    mutate(payload, {
      onSuccess: () => {
        notification(
          "Success",
          "Your preferences was successfully updated",
          "success"
        )
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
          <div className="mt-5xlarge flex flex-col max-w-[700px] w-full">
            <h1 className="inter-xlarge-semibold mb-large">
              Specify your preferences
            </h1>
            <div className="mb-xlarge">
              <InputField
                {...register("email")}
                label="Your email"
                placeholder="you@company.com"
                className="max-w-[338px]"
              />
            </div>
            <div className="flex flex-col gap-y-xlarge">
              <div className="flex items-start">
                <div className="flex flex-col flex-1 gap-y-2xsmall">
                  <h2 className="inter-base-semibold">
                    Anonymize my usage data
                  </h2>
                  <p className="inter-base-regular text-grey-50">
                    We collect data only for product improvements. Read how we
                    do it in the{" "}
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
                  name="anonymize"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        disabled={!emailSubscriber}
                      />
                    )
                  }}
                />
              </div>
              <div className="flex items-start">
                <div className="flex flex-col flex-1 gap-y-2xsmall">
                  <h2 className="inter-base-semibold">
                    News and feature updates
                  </h2>
                  <p className="inter-base-regular text-grey-50">
                    Receive emails about feature updates. You can unsubscribe
                    any time.
                  </p>
                </div>
                <Controller
                  name="news_updates"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        disabled={!emailSubscriber}
                      />
                    )
                  }}
                />
              </div>
              <div className="flex items-start">
                <div className="flex flex-col flex-1 gap-y-2xsmall">
                  <h2 className="inter-base-semibold">Security updates</h2>
                  <p className="inter-base-regular text-grey-50">
                    Receive emails security updates.
                  </p>
                </div>
                <Controller
                  name="security_updates"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        disabled={!emailSubscriber}
                      />
                    )
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
