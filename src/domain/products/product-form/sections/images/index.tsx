import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import FileUploadField from "../../../../../components/atoms/file-upload-field"
import BodyCard from "../../../../../components/organisms/body-card"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { useProductForm } from "../../form/product-form-context"
import { FormImage } from "../../utils/types"
import ImageTable, { DataType } from "./image-table"

const Images = () => {
  const { register, setImageDirtyState, control } = useProductForm()

  const { fields, append, remove } = useFieldArray<FormImage>({
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
          render={({ value, onChange }) => {
            return (
              <RadioGroup.Root
                value={value}
                onValueChange={(value) => {
                  onChange(value)
                }}
              >
                <ImageTable
                  data={fields as DataType[]}
                  onDelete={handleRemove}
                />
                {fields.map((field, index) => {
                  return (
                    <div key={index} className="flex items-center">
                      <input
                        className="hidden"
                        name={`images[${index}].url`}
                        ref={register()}
                        defaultValue={field.url}
                      />
                      {field.nativeFile && (
                        <>
                          <input
                            className="hidden"
                            name={`images[${index}].name`}
                            ref={register()}
                            defaultValue={field.name}
                          />
                          <input
                            className="hidden"
                            name={`images[${index}].size`}
                            ref={register()}
                            defaultValue={field.size}
                          />
                          <Controller
                            name={`images[${index}].nativeFile`}
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
