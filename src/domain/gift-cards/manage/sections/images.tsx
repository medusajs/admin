import React from "react"
import { Controller } from "react-hook-form"
import FileUploadField from "../../../../components/atoms/file-upload-field"
import BodyCard from "../../../../components/organisms/body-card"
import RadioGroup from "../../../../components/organisms/radio-group"
import DraggableTable from "../../../../components/templates/draggable-table"
import { useGiftCardForm } from "../form/gift-card-form-context"
import { columns } from "../../../products/product-form/sections/images"

const Images = () => {
  const { images, setImages, appendImage, removeImage, control } =
    useGiftCardForm()

  return (
    <BodyCard title="Images" subtitle="Add up to 10 images to your Gift Card">
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
                <DraggableTable
                  onDelete={removeImage}
                  columns={columns}
                  entities={images}
                  setEntities={setImages}
                />
              </RadioGroup.Root>
            )
          }}
        />
      </div>
      <div className="mt-2xlarge">
        <FileUploadField
          onFileChosen={(files) => {
            const file = files[0]
            const url = URL.createObjectURL(file)
            appendImage({
              url,
              name: file.name,
              size: file.size,
              nativeFile: file,
            })
          }}
          placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
          filetypes={["png", "jpg", "jpeg"]}
          className="py-large"
        />
      </div>
    </BodyCard>
  )
}

export default Images
