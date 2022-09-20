import React from "react"
import { Controller } from "react-hook-form"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../utils/nested-form"

export type SendNotificationFormType = {
  send_notification: boolean
}

type Props = {
  form: NestedForm<SendNotificationFormType>
}

const SendNotificationForm = ({ form }: Props) => {
  const { control, path } = form

  return (
    <Controller
      control={control}
      name={path("send_notification")}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="flex items-center">
            <div className="mr-xsmall">
              <IndeterminateCheckbox checked={value} onChange={onChange} />
            </div>
            <p className="inter-small-semibold mr-1.5">Send notifications</p>
            <IconTooltip
              type="info"
              content="If unchecked the customer will not receive communication about this exchange."
            />
          </div>
        )
      }}
    />
  )
}

export default SendNotificationForm
