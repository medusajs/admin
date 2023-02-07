import { Controller } from "react-hook-form"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../utils/nested-form"

export type ReceiveNowFormType = {
  receive_now: boolean
}

type Props = {
  form: NestedForm<ReceiveNowFormType>
}

const ReceiveNowForm = ({ form }: Props) => {
  const { control, path } = form

  return (
    <Controller
      control={control}
      name={path("receive_now")}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="flex items-center">
            <div className="mr-xsmall">
              <IndeterminateCheckbox checked={value} onChange={onChange} />
            </div>
            <p className="inter-small-semibold mr-1.5">Receive now</p>
            <IconTooltip
              type="info"
              content="If checked the return will be received immediately."
            />
          </div>
        )
      }}
    />
  )
}

export default ReceiveNowForm
