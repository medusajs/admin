import { storiesOf } from "@storybook/react"
import React, { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import VariantOptionsForm, {
  VariantOptionsFormType,
  VariantOptionValueType,
} from "."
import { nestedForm } from "../../../../../utils/nested-form"

const options: VariantOptionValueType[] = [
  {
    option_id: "1",
    value: "Red",
    label: "Red",
  },
  {
    option_id: "1",
    value: "Blue",
    label: "Blue",
  },
  {
    option_id: "1",
    value: "Green",
    label: "Green",
  },
  {
    option_id: "2",
    value: "Small",
    label: "Small",
  },
  {
    option_id: "2",
    value: "Medium",
    label: "Medium",
  },
  {
    option_id: "2",
    value: "Large",
    label: "Large",
  },
  {
    option_id: "2",
    value: "XLarge",
    label: "XLarge",
  },
  {
    option_id: "3",
    value: "Cotton",
    label: "Cotton",
  },
  {
    option_id: "3",
    value: "Polyester",
    label: "Polyester",
  },
  {
    option_id: "3",
    value: "Nylon",
    label: "Nylon",
  },
  {
    option_id: "3",
    value: "Rayon",
    label: "Rayon",
  },
]

storiesOf(
  "Domains/Product/Components/VariantForm/VariantOptionsForm",
  module
).add("Base", () => {
  const [opts, setOpts] = useState(options)

  const onCreateOption = (option: VariantOptionValueType) => {
    setOpts([...opts, option])
  }

  const form = useForm<{
    options: VariantOptionsFormType
  }>({
    defaultValues: {
      options: {
        variant_options: [
          {
            id: "1",
            title: "Color",
            value: null,
          },
          {
            id: "2",
            title: "Size",
            value: null,
          },
          {
            id: "3",
            title: "Material",
            value: null,
          },
        ],
      },
    },
  })

  const liveData = useWatch({
    control: form.control,
    name: "options.variant_options",
  })

  return (
    <div>
      <VariantOptionsForm
        form={nestedForm(form, "options")}
        options={opts}
        onCreateOption={onCreateOption}
      />

      <div className="bg-grey-5 rounded-rounded px-small py-xsmall mt-xlarge mono-small-regular text-grey-50">
        <h1 className="inter-base-semibold mb-small">Data</h1>
        <pre>{JSON.stringify(liveData, null, 4)}</pre>
      </div>
    </div>
  )
})
