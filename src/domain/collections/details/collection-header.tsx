import React, { useEffect, useState } from "react"
import InputField from "../../../components/molecules/input"
import Metadata, { MetadataField } from "../../../components/organisms/metadata"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import Actionables from "../../../components/molecules/actionables"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"

type CollectionHeaderProps = {
  onSubmit: (values: any, metadata: MetadataField[]) => void
  collection?: any
  register?: any
  setValue?: any
  handleSubmit?: any
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  onSubmit,
  collection,
  register,
  setValue,
  handleSubmit,
}) => {
  const [metadata, setMetadata] = useState<MetadataField[]>([])
  const [showDelete, setShowDelete] = useState(false)

  if (!collection) {
    throw new Error("Collection is required for edit")
  }

  useEffect(() => {
    register("title", { required: true })
    register("handle")
  }, [])

  useEffect(() => {
    if (collection) {
      setValue("title", collection.title)
      setValue("handle", collection.handle)

      if (collection.metadata) {
        Object.entries(collection.metadata).map(([key, value]) => {
          const newMeta = metadata
          newMeta.push({ key, value })
          setMetadata(newMeta)
        })
      }
    }
  }, [collection])

  const submit = (data: any) => {
    onSubmit(data, metadata)
  }

  return (
    <div>
      <div className={"mb-2xlarge"}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">General</h1>
            <p className="inter-small-regular text-grey-50">
              To create a collection, all you need is a title and a handle.
            </p>
          </div>

          <Actionables
            forceDropdown
            actions={[
              {
                label: "Delete",
                onClick: () => setShowDelete(!showDelete),
                variant: "danger",
                icon: <TrashIcon size="20" />,
              },
            ]}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <div>
            <h2 className="inter-base-semibold mb-base">Details</h2>
            <div className="flex items-center gap-x-base">
              <InputField
                label="Title"
                required
                placeholder="Sunglasses"
                name="title"
                ref={register({ required: true })}
              />
              <InputField
                label="Handle"
                placeholder="sunglasses"
                name="handle"
                prefix="/"
                tooltip={
                  <IconTooltip content="URL Slug for the product. Will be auto generated if left blank." />
                }
                ref={register}
              />
            </div>
          </div>
          <div className="mt-xlarge w-full">
            <Metadata setMetadata={setMetadata} metadata={metadata} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default CollectionHeader
