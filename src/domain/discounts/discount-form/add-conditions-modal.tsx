import React from "react"

import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import RadioGroup from "../../../components/organisms/radio-group"
import IconTooltip from "../../../components/molecules/icon-tooltip"

type AddConditionsModalProps = {
  value?: string
  setValue: (v: string) => void
  close: () => void
}

const Items = [
  {
    label: "Product",
    value: "products",
    description: "Only for specific products",
  },
  {
    label: "Customer group",
    value: "customer_groups",
    description: "Only for specific customer groups",
  },
  {
    label: "Tag",
    value: "tags",
    description: "Only for specific tags",
  },
  {
    label: "Collection",
    value: "collections",
    description: "Only for specific product collections",
  },
  {
    label: "Type",
    value: "types",
    description: "Only for specific product types",
  },
]

function AddConditionsModal(props: AddConditionsModalProps) {
  const { close, value, setValue } = props

  const handleSubmit = () => {}

  return (
    <Modal handleClose={close}>
      <Modal.Body className="h-[1016px] max-h-screen">
        <Modal.Header handleClose={close}>
          <span className="inter-xlarge-semibold">Add Conditions</span>
          <span className="font-semibold text-grey-90 mt-6 flex items-center gap-1">
            Choose a condition type <IconTooltip content="TODO add text?" />
          </span>
        </Modal.Header>
        <Modal.Content>
          <RadioGroup.Root value={value} onValueChange={setValue}>
            {Items.map((t) => (
              <RadioGroup.SimpleItem
                {...t}
                className="rounded-lg border border-1 p-4 mb-2 w-full"
                label={<span className="font-semibold">{t.label}</span>}
                description={
                  <span className="text-grey-50 float-right">
                    {t.description}
                  </span>
                }
              />
            ))}
          </RadioGroup.Root>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center"
              size="large"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              size="large"
              disabled={!value}
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddConditionsModal
