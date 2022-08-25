import React from "react"
import InputField from "../../../../components/molecules/input"
import TextArea from "../../../../components/molecules/textarea"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  description: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
}

const GeneralForm = ({ form }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-small">
        <InputField
          label="Title"
          placeholder="Winter Jacket"
          required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label="Subtitle"
          placeholder="Warm and cozy..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Give your product a short and clear title.
        <br />
        50-60 characters is the recommended length for search engines.
      </p>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <InputField
          label="Handle"
          placeholder="winter-jacket"
          required
          {...register(path("handle"), {
            required: "Handle is required",
            minLength: {
              value: 1,
              message: "Handle must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
      </div>
      <TextArea
        label="Description"
        placeholder="A warm and cozy jacket..."
        rows={3}
        className="mb-small"
        {...register(path("description"), {
          pattern: FormValidator.whiteSpaceRule("Description"),
        })}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        Give your product a short and clear description.
        <br />
        120-160 characters is the recommended length for search engines.
      </p>
    </div>
  )
}

export default GeneralForm
