import React, { useEffect, useState } from "react"
import InputField from "../../../../components/molecules/input"
import Metadata, {
  MetadataField,
} from "../../../../components/organisms/metadata"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Actionables from "../../../../components/molecules/actionables"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { useProductCollectionForm } from "../form/product-collection-form-context"

type CollectionHeaderProps = {
  collection?: any
  isEdit?: boolean
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  collection,
  isEdit = false,
}) => {
  const [showDelete, setShowDelete] = useState(false)
  const {
    onSubmit,
    register,
    setValue,
    handleSubmit,
    setHasMetadataChanged,
    metadata,
    setMetadata,
  } = useProductCollectionForm()

  if (isEdit && !collection) {
    throw new Error("Collection is required for edit")
  }

  const handleSetMetadata = (metadata: MetadataField[]) => {
    setMetadata(metadata)
    setHasMetadataChanged(true)
  }

  useEffect(() => {
    register("title", { required: true })
    register("handle")
  }, [])

  useEffect(() => {
    if (isEdit && collection) {
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
  }, [collection, isEdit])

  const submit = (data: any) => {
    onSubmit({ ...data })
  }

  return (
    <div>
      <div className={"mb-2xlarge"}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">General</h1>
            <p className="inter-small-regular text-grey-50">
              {isEdit
                ? "You can edit the title and handle of this collection."
                : "To create a collection, all you need is a title and a handle."}
            </p>
          </div>

          {isEdit && (
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
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(submit)}>
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
      </form>

      <div className="mt-xlarge w-full">
        <Metadata setMetadata={handleSetMetadata} metadata={metadata} />
      </div>
    </div>
  )
}

export default CollectionHeader
