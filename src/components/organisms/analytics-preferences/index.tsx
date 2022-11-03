import React from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { useAdminCreateAnalyticsConfig } from "../../../services/analytics"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import FocusModal from "../../molecules/modal/focus-modal"
import AnalyticsConfigForm, {
  AnalyticsConfigFormType,
} from "../analytics-config-form"

const AnalyticsPreferencesModal = () => {
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateAnalyticsConfig()
  const form = useForm<AnalyticsConfigFormType>({
    defaultValues: {
      anonymize: false,
      opt_out: false,
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    mutate(data, {
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
            <div className="mt-xlarge">
              <AnalyticsConfigForm form={form} />
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
