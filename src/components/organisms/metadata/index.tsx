import React, { useEffect } from "react"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InputField from "../../molecules/input"

type AddMetadataProps = {
  control: any
  heading?: string
  existingMetadata?: object
}

type KP = {
  key: string
  value: any
}

const Metadata: React.FC<AddMetadataProps> = ({
  control,
  heading = "Metadata",
  existingMetadata,
}) => {
  const [keyPairs, setKeyPairs] = React.useState<KP[]>([])

  const addKeyPair = () => {
    const baseName = `metadata.${keyPairs.length}`

    setKeyPairs([
      ...keyPairs,
      { key: `${baseName}.key`, value: `${baseName}.value` },
    ])
  }

  const deleteKeyPair = (index: number) => {
    control.unregister(keyPairs[index].key)
    control.unregister(keyPairs[index].value)

    setKeyPairs(keyPairs.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (existingMetadata) {
      for (const key of Object.keys(existingMetadata)) {
        control.register(`metadata.${keyPairs.length}.key`)
        control.register(`metadata.${keyPairs.length}.value`)

        addKeyPair()

        control.setValue(`metadata.${keyPairs.length}.key`, key)
        control.setValue(
          `metadata.${keyPairs.length}.value`,
          existingMetadata[key]
        )
      }
    }
  }, [existingMetadata])

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
              <KeyPair
                k={keyPair.key}
                v={keyPair.value}
                register={control.register}
              />
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
        <InputField label="Key" name={k} ref={register({ required: true })} />
      </div>
      <div className="flex-grow">
        <InputField label="Value" name={v} ref={register({ required: true })} />
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

export default Metadata
