import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import FileUploadField from "../../../../../components/atoms/file-upload-field"
import BodyCard from "../../../../../components/organisms/body-card"
import RadioGroup from "../../../../../components/organisms/radio-group"
import ImageTable, {
  ImageTableDataType,
} from "../../../../../components/templates/image-table"
import { nestedForm } from "../../../../../utils/nested-form"
import { useProductForm } from "../../form/product-form-context"

const Images = () => {
  const form = useProductForm()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  })

  const handleRemove = (index: number) => {
    form.setImageDirtyState(true)
    remove(index)
  }

  const handleFilesChosen = (files: File[]) => {
    if (files.length) {
      const toAppend = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        nativeFile: file,
      }))

      append(toAppend)
    }
  }

  return (
    <BodyCard title="Images" subtitle="Add up to 10 images to your product">
      <div className="mt-base">
        <Controller
          name="thumbnail"
          control={form.control}
          render={({ field: { value, onChange } }) => {
            return (
              <RadioGroup.Root
                value={value ? `${value}` : undefined}
                onValueChange={(value) => {
                  onChange(parseInt(value))
                }}
              >
                <ImageTable
                  data={fields as ImageTableDataType[]}
                  form={nestedForm(form, "images")}
                  onDelete={handleRemove}
                />
              </RadioGroup.Root>
            )
          }}
        />
      </div>
      <div className="mt-2xlarge">
        <FileUploadField
          onFileChosen={handleFilesChosen}
          placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
          filetypes={["image/gif", "image/jpeg", "image/png", "image/webp"]}
          className="py-large"
        />
      </div>
    </BodyCard>
  )
}

export default Images
