import { Controller } from "react-hook-form"
import RadioGroup from "../../../components/organisms/radio-group"
import { NestedForm } from "../../../utils/nested-form"
import { PriceListTypeFormData } from "../types"

type Props = {
  form: NestedForm<PriceListTypeFormData>
}

const PriceListTypeForm = ({ form }: Props) => {
  const { control, path } = form

  return (
    <Controller
      name={path("type")}
      control={control}
      render={({ field }) => {
        return (
          <RadioGroup.Root {...field}>
            <RadioGroup.Item value="sale" label="Sale" />
            <RadioGroup.Item value="override" label="Override" />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default PriceListTypeForm
