import React, { useContext } from "react"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import RadioGroup from "../../../components/organisms/radio-group"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import { useDiscountForm } from "./form/discount-form-context"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import useConditionModalItems from "./use-condition-modal-items"

type AddConditionsModalProps = {
  value?: string
  setValue: (v: string) => void
  close: () => void
}

function AddConditionsModal(props: AddConditionsModalProps) {
  const { close } = props
  const layeredModalContext = useContext(LayeredModalContext)

  const { register, conditionType, setConditionType } = useDiscountForm()

  const onNext = () => {
    layeredModalContext.push({
      title: "Condition type",
      onBack: () => layeredModalContext.pop(),
      view: <h3 className="p-8">{conditionType} selection TODO</h3>,
    })
  }

  const onClose = () => {
    setConditionType(undefined)
    close()
  }

  const it = useConditionModalItems(close)

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
          <RadioGroup.Root
            name="condition_type"
            value={conditionType}
            onValueChange={setConditionType}
            ref={register("condition_type")}
          >
            {it.map((t) => (
              <RadioGroup.SimpleItem
                {...t}
                className="rounded-lg border border-1 p-4 mb-2 w-full"
                onClick={t.onClick}
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
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default AddConditionsModal
