import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import FileUploadField from "../../../../../components/atoms/file-upload-field"
import BodyCard from "../../../../../components/organisms/body-card"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { useProductForm } from "../../form/product-form-context"
import ImageTable, { DataType } from "./image-table"

const Images = () => {
  const { register, setImageDirtyState, control } = useProductForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  const handleRemove = (index: number) => {
    setImageDirtyState(true)
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
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <RadioGroup.Root
                value={value ? `${value}` : undefined}
                onValueChange={(value) => {
                  onChange(parseInt(value))
                }}
              >
                <ImageTable
                  data={fields as DataType[]}
                  onDelete={handleRemove}
                />
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="flex items-center">
                      <input
                        className="hidden"
                        {...register(`images.${index}.url`)}
                        defaultValue={field.url}
                      />
                      {field.nativeFile && (
                        <>
                          <input
                            className="hidden"
                            {...register(`images.${index}.name`)}
                            defaultValue={field.name}
                          />
                          <input
                            className="hidden"
                            {...register(`images.${index}.size`)}
                            defaultValue={field.size}
                          />
                          <Controller
                            name={`images.${index}.nativeFile`}
                            control={control}
                            defaultValue={field.nativeFile}
                            render={() => <></>}
                          />
                        </>
                      )}
                    </div>
                  )
                })}
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
