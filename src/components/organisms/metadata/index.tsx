import React, { useEffect, useState } from "react"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InputField from "../../molecules/input"

type AddMetadataProps = {
  metadata: MetadataField[]
  setMetadata: (metadata: MetadataField[]) => void
  heading?: string
}

enum MetadataErrors {
  duplicate_keys = "duplicate_keys",
}

export type MetadataField = {
  key: string
  value: any
}

function testForDuplicateKeys(metadata) {
  const keys = metadata.map((m) => m.key)
  const uniqueKeys = [...new Set(keys)]
  return keys.length !== uniqueKeys.length
}

const Metadata: React.FC<AddMetadataProps> = ({
  metadata,
  setMetadata,
  heading = "Metadata",
}) => {
  const [localData, setLocalData] = useState<MetadataField[]>([])
  const [error, setError] = useState<MetadataErrors>()

  useEffect(() => {
    setLocalData(metadata)
  }, [metadata])

  const addKeyPair = () => {
    setMetadata([...metadata, { key: ``, value: `` }])
  }

  const onKeyChange = (index: number) => (key: string) => {
    const newFields = metadata
    newFields[index] = { key, value: newFields[index].value }

    if (testForDuplicateKeys(newFields)) {
      setError(MetadataErrors.duplicate_keys)
      return
    }

    setError(undefined)
    setMetadata(newFields)
  }

  const onValueChange = (index: number) => (value: any) => {
    const newFields = metadata
    newFields[index] = {
      key: newFields[index].key,
      value: value,
    }
    setMetadata(newFields)
  }

  const deleteKeyPair = (index: number) => () => {
    setError(undefined)
    setMetadata(metadata.filter((_, i) => i !== index))
  }

  return (
    <div>
      <span className="inter-base-semibold">{heading}</span>
      <div className="flex flex-col mt-base gap-y-base">
        {localData.map((field, index) => {
          return (
            <DeletableElement key={index} onDelete={deleteKeyPair(index)}>
              <Field
                field={field}
                updateKey={onKeyChange(index)}
                updateValue={onValueChange(index)}
              />
            </DeletableElement>
          )
        })}
        {error === MetadataErrors.duplicate_keys && (
          <p className="text-orange-60">Metadata cannot have duplicate keys.</p>
        )}
        <div>
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={addKeyPair}
          >
            <PlusIcon size={20} />
            Add Metadata
          </Button>
        </div>
      </div>
    </div>
  )
}

type FieldProps = {
  field: MetadataField
  updateKey: (key: string) => void
  updateValue: (value: string) => void
}

const Field: React.FC<FieldProps> = ({ field, updateKey, updateValue }) => {
  return (
    <div className="flex items-center w-full gap-x-xsmall">
      <div className="maw-w-[200px]">
        <InputField
          label="Key"
          placeholder="Some key"
          defaultValue={field.key}
          onChange={(e) => {
            updateKey(e.currentTarget.value)
          }}
        />
      </div>
      <div className="flex-grow">
        <InputField
          label="Value"
          placeholder="Some value"
          defaultValue={field.value}
          onChange={(e) => {
            updateValue(e.currentTarget.value)
          }}
        />
      </div>
    </div>
  )
}

type DeletableElementProps = {
  onDelete: () => void
}

const DeletableElement: React.FC<DeletableElementProps> = ({
  onDelete,
  children,
}) => {
  return (
    <div className="flex items-center gap-x-xlarge">
      <div className="flex-grow">{children}</div>
      <Button
        variant="ghost"
        size="small"
        className="text-grey-40 justify-end"
        type="button"
        onClick={onDelete}
      >
        <TrashIcon size={20} />
      </Button>
    </div>
  )
}

export default Metadata
