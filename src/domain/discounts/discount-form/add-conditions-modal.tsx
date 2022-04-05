import React, { useRef } from "react"

import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import RadioGroup from "../../../components/organisms/radio-group"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import { useDiscountForm } from "./form/discount-form-context"

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
  const { close } = props

  const { register, conditionType, setConditionType } = useDiscountForm()

  const { current: initialSetting } = useRef(conditionType)

  const onSave = () => {
    close()
  }

  const onClose = () => {
    setConditionType(initialSetting)
    close()
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body className="h-[calc(100vh-134px)] flex flex-col">
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">Add Conditions</span>
          <span className="font-semibold text-grey-90 mt-6 flex items-center gap-1">
            Choose a condition type <IconTooltip content="TODO add text?" />
          </span>
        </Modal.Header>

        <Modal.Content className="flex-1">
          <RadioGroup.Root
            name="condition_type"
            value={conditionType}
            onValueChange={setConditionType}
            ref={register("condition_type")}
          >
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
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="large"
              disabled={!conditionType}
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={onSave}
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
