import React from "react"
import { Controller } from "react-hook-form"
import FileUploadField from "../../../../components/atoms/file-upload-field"
import BodyCard from "../../../../components/organisms/body-card"
import RadioGroup from "../../../../components/organisms/radio-group"
import DraggableTable from "../../../../components/templates/draggable-table"
import { useGiftCardForm } from "../form/gift-card-form-context"

const columns = [
  {
    Header: "Image",
    accessor: "image",
    Cell: ({ cell }) => {
      return (
        <div className="py-base large:w-[176px] xsmall:w-[80px]">
          <img
            className="h-[80px] w-[80px] object-cover rounded"
            src={cell.row.original.url}
          />
        </div>
      )
    },
  },
  {
    Header: "File Name",
    accessor: "name",
    Cell: ({ cell }) => {
      return (
        <div className="large:w-[700px] medium:w-[400px] small:w-auto">
          <p className="inter-small-regular">{cell.row.original?.name}</p>
          <span className="inter-small-regular text-grey-50">
            {typeof cell.row.original.size === "number"
              ? `${(cell.row.original.size / 1024).toFixed(2)} KB`
              : cell.row.original?.size}
          </span>
        </div>
      )
    },
  },
  {
    Header: <div className="text-center">Thumbnail</div>,
    accessor: "thumbnail",
    Cell: ({ cell }) => {
      return (
        <div className="flex justify-center">
          <RadioGroup.SimpleItem
            className="justify-center"
            value={cell.row.index}
          />
        </div>
      )
    },
  },
]

const Images = () => {
  const {
    images,
    setImages,
    appendImage,
    removeImage,
    control,
  } = useGiftCardForm()

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
