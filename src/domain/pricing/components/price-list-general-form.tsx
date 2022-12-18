import InputField from "../../../components/molecules/input"
import TextArea from "../../../components/molecules/textarea"
import { NestedForm } from "../../../utils/nested-form"
import { PriceListGeneralFormData } from "../types"

type Props = {
  form: NestedForm<PriceListGeneralFormData>
}

const PriceListGeneralForm = ({ form }: Props) => {
  const {
    formState: { errors },
    register,
    path,
  } = form

  return (
    <div className="flex flex-col gap-y-small">
      <InputField
        label="Name"
        placeholder="Wholesale"
        required
        {...register(path("name"), {
          required: "Name is required",
        })}
        errors={errors}
      />
      <TextArea
        label="Description"
        placeholder="Price list for wholesale customers"
        required
        {...register(path("description"), {
          required: "Description is required",
        })}
        errors={errors}
      />
    </div>
  )
}

export default PriceListGeneralForm
