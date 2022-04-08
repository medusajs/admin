import React, { useContext } from "react"

import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import { useDiscountForm } from "./form/promotion-form-context"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import ChevronRightIcon from "../../../components/fundamentals/icons/chevron-right-icon"

type AddConditionsModalProps = {
  value?: string
  setValue: (v: string) => void
  close: () => void
}

type ConditionItem = {
  label: string
  value: "products" | "customer_groups" | "tags" | "collections" | "types"
  description: string
}

const Items: ConditionItem[] = [
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

function ConditionTypeItem(props: ConditionItem) {
  const { label, description, value } = props

  const layeredModalContext = useContext(LayeredModalContext)
  const { register, conditionType, setConditionType } = useDiscountForm()

  const onClick = () => {
    setConditionType(value)
    layeredModalContext.push({
      title: "Condition type",
      onBack: () => layeredModalContext.pop(),
      view: <h3 className="p-8">{value} selection TODO</h3>,
    })
  }

  return (
    <div
      name="condition_type"
      value={conditionType}
      onClick={onClick}
      ref={register("condition_type")}
      className="rounded-lg border border-1 p-4 mb-2 cursor-pointer hover:bg-grey-5 transition-all w-full flex items-center justify-between"
    >
      <div>
        <div className="font-semibold ">{label}</div>
        <div className="text-grey-50 float-right">{description}</div>
      </div>
      <ChevronRightIcon width={16} height={32} className="text-grey-50" />
    </div>
  )
}

function AddConditionsModal(props: AddConditionsModalProps) {
  const { close } = props
  const layeredModalContext = useContext(LayeredModalContext)

  const { setConditionType } = useDiscountForm()

  const onClose = () => {
    setConditionType(undefined)
    close()
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={onClose}>
      <Modal.Body className="h-[calc(100vh-134px)] flex flex-col">
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">Add Conditions</span>
          <span className="font-semibold text-grey-90 mt-6 flex items-center gap-1">
            Choose a condition type <IconTooltip content="TODO add text?" />
          </span>
        </Modal.Header>

        <Modal.Content className="flex-1">
          {Items.map((t) => (
            <ConditionTypeItem key={t.value} {...t} />
          ))}
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
              disabled
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default AddConditionsModal
