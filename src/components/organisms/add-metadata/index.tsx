import React from "react"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InputField from "../../molecules/input"

type AddMetadataProps = {
  register: Function
  unregister: Function
  heading?: string
}

type KeyPair = {
  key: string
  value: any
}

const AddMetadata: React.FC<AddMetadataProps> = ({
  register,
  unregister,
  heading = "Metadata",
}) => {
  const [keyPairs, setKeyPairs] = React.useState<KeyPair[]>([])

  const addKeyPair = () => {
    const baseName = `metadata.${keyPairs.length}`

    setKeyPairs([
      ...keyPairs,
      { key: `${baseName}.key`, value: `${baseName}.value` },
    ])
  }

  const deleteKeyPair = (index: number) => {
    unregister(keyPairs[index].key)
    unregister(keyPairs[index].value)

    setKeyPairs(keyPairs.filter((_, i) => i !== index))
  }

  return (
    <div>
      <span className="inter-base-semibold">{heading}</span>
      <div className="flex flex-col mt-base gap-y-base">
        {keyPairs.map((keyPair, index) => {
          return (
            <DeletableElement
              key={index}
              index={index}
              onDelete={deleteKeyPair}
            >
              <KeyPair k={keyPair.key} v={keyPair.value} register={register} />
            </DeletableElement>
          )
        })}
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

type KeyPairProps = {
  k: string
  v: string
  register: any
} & React.HTMLAttributes<HTMLDivElement>

const KeyPair: React.FC<KeyPairProps> = ({ k, v, register }) => {
  return (
    <div className="flex items-center w-full gap-x-xsmall">
      <div className="maw-w-[200px]">
        <InputField label="Key" name={k} ref={register} />
      </div>
      <div className="flex-grow">
        <InputField label="Value" name={v} ref={register} />
      </div>
    </div>
  )
}

type DeletableElementProps = {
  onDelete: (index: number) => void
  index: number
}

const DeletableElement: React.FC<DeletableElementProps> = ({
  index,
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
        onClick={() => onDelete(index)}
      >
        <TrashIcon size={20} />
      </Button>
    </div>
  )
}

export default AddMetadata
