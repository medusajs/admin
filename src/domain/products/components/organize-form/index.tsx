import React from "react"
import { Controller } from "react-hook-form"
import Select from "../../../../components/molecules/select"
import TagInput from "../../../../components/molecules/tag-input"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import useOrganizeData from "./use-organize-data"

export type OrganizeFormType = {
  type: Option | null
  collection: Option | null
  tags: string[] | null
}

type Props = {
  form: NestedForm<OrganizeFormType>
}

const OrganizeForm = ({ form }: Props) => {
  const { control, path } = form
  const { productTypeOptions, collectionOptions } = useOrganizeData()

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <Controller
          name={path("type")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Select
                label="Type"
                onChange={onChange}
                options={productTypeOptions}
                value={value || null}
              />
            )
          }}
        />
        <Controller
          name={path("collection")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Select
                label="Collection"
                onChange={onChange}
                options={collectionOptions}
                value={value}
              />
            )
          }}
        />
      </div>
      <Controller
        control={control}
        name={path("tags")}
        render={({ field: { value, onChange } }) => {
          return <TagInput onChange={onChange} values={value || []} />
        }}
      />
    </div>
  )
}

export default OrganizeForm
